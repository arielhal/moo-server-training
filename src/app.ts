import {errorHandlerMiddleware} from './middlewares/error-handler';
import {loggingMiddleware} from './middlewares/logging-middleware';
import {productsRouter} from './routers/product-router';
import Koa = require('koa');
import bodyParser = require('koa-bodyparser');
import {ApolloServer, PubSub} from 'apollo-server-koa';

import http = require('http');
import {productSchemas} from './graphql/schemas/product-schemas';
import {resolvers} from './graphql/resolvers/product-resolvers';
import {authenticationMiddleware} from './middlewares/authentication-middleware';

export const pubsub = new PubSub();
export const app = new Koa();

app
    .use(bodyParser())
    .use(productsRouter.allowedMethods())
    .use(authenticationMiddleware)
    .use(loggingMiddleware)
    .use(errorHandlerMiddleware)
    .use(productsRouter.routes());
const typeDefs = productSchemas;
const graphQLServer = new ApolloServer({
    typeDefs, resolvers,
    context: async ({ctx}) => ({ctx}),
    playground: {
        settings: {
            'request.credentials': 'include'
        }
    }
});
graphQLServer.applyMiddleware({app});
export const server = http.createServer(app.callback());
graphQLServer.installSubscriptionHandlers(server);

