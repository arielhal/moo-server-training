import Koa = require('koa');
import {productsRouter} from '../routers/product-router';
import bodyParser = require('koa-bodyparser');
import mongoose = require('mongoose');
import {logger, loggerMiddleware} from '../middlewares/logger';
import {config} from '../configurations/configuration';
import {errorHandlerMiddleware} from '../middlewares/error-handler';

const connectToDB = async () => {
    try {
        logger.info(config.get('dbURI'));
        await mongoose.connect(config.get('dbURI'), {
            useNewUrlParser: true,
            bufferCommands: false,
            useUnifiedTopology: true
        });
        logger.info('Connected successfully to DB!');
        const db = mongoose.connection;
        db.on('error', () => logger.error('DB connection error'));
        db.on('reconnect', () => logger.info('Reconnected to DB successfully'));
        db.on('reconnectFailed', () => logger.error('Reached maximal connection retries to DB'));
        db.on('disconnected', () => logger.error('Connection to DB is lost!'));
    } catch (err) {
        logger.error('Initial connection do DB failed!');
    }
};


const app = new Koa();
connectToDB();

app
    .use(loggerMiddleware)
    .use(errorHandlerMiddleware)
    .use(bodyParser())
    .use(productsRouter.routes())
    .use(productsRouter.allowedMethods());

app.listen(config.get('port'));