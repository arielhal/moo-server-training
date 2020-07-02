import {Context} from 'koa';
import {logger} from '../logger/logger';

export const loggingMiddleware = async (ctx: Context, next: () => Promise<any>) => {
    logger.info(`got ${ctx.request.method}: ${ctx.request.path} request from ${ctx.request.ip}`);
    try {
        await next();
    } catch (err) {
        logger.error(`Client: ${ctx.request.ip}, status: ${err.status}, message: ${err.message}`);
    }
};