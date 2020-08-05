import {errorHandlerMiddleware} from './middlewares/error-handler';
import {productsRouter} from './routers/product-router';
import Koa = require('koa');
import bodyParser = require('koa-bodyparser');

export const app = new Koa();

app
    .use(bodyParser())
    .use(productsRouter.allowedMethods())
    .use(errorHandlerMiddleware)
    .use(productsRouter.routes());
