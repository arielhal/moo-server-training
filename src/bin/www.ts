import Koa = require('koa');
import {productsRouter} from '../routers/product-router';
import bodyParser = require('koa-bodyparser');
import {loggingMiddleware} from '../middlewares/logging-middleware';
import {config} from '../../configurations/configuration';
import {errorHandlerMiddleware} from '../middlewares/error-handler';
import {connectToDB} from '../actions/db-connector';


const app = new Koa();
connectToDB();

app
    .use(loggingMiddleware)
    .use(errorHandlerMiddleware)
    .use(bodyParser())
    .use(productsRouter.routes())
    .use(productsRouter.allowedMethods());

app.listen(config.get('port'));