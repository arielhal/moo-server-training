import {Context} from 'koa';
import {config} from '../utils/configuration';
import {logger} from '../utils/logger';

export const errorHandlerMiddleware = async (ctx: Context, next: () => Promise<any>) => {
    try {
        logger.info(`got ${ctx.request.method}: ${ctx.request.path} request from ${ctx.request.ip}`);
        await next();
    } catch (err) {
        if (err.status)
            ctx.status = err.status;
        else
            ctx.status = 500;
        if (!config.get('dev') && ctx.status === 500) {
            ctx.body = 'Internal Server Error';
        } else {
            ctx.body = err.message;
        }
        logger.error(`Client: ${ctx.request.ip}, status: ${ctx.status}, message: ${err.message}`);
        throw err;
    }
};
