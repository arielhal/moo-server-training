import {errorHandlerMiddleware} from './middlewares/error-handler';
import {loggingMiddleware} from './middlewares/logging-middleware';
import {productsRouter} from './routers/product-router';
import Koa = require('koa');
import bodyParser = require('koa-bodyparser');
import socket = require('socket.io');

import http = require('http');
import {logger} from './utils/logger';

export const app = new Koa();

app
    .use(bodyParser())
    .use(productsRouter.allowedMethods())
    .use(loggingMiddleware)
    .use(errorHandlerMiddleware)
    .use(productsRouter.routes());

export const server = http.createServer(app.callback());
export const io = new socket(server);

io.on('connection', (sock) => {
    logger.info('a user connected');
    sock.on('disconnect', () => {
        logger.info('user disconnected');
    });
});