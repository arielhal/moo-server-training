import {Context} from 'koa';
import {logger} from '../utils/logger';

export const loggingMiddleware = async (ctx: Context, next: () => Promise<any>) => {
    logger.info(`got ${ctx.request.method}: ${ctx.request.path} request from ${ctx.request.ip}`);
    await next();
    logger.info(`Client: ${ctx.request.ip} got response status: ${ctx.response.status} body: ${JSON.stringify(ctx.response.body)}`);
};