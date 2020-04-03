import {Context} from 'koa';
import {config} from '../configurations/configuration';

export const errorHandlerMiddleware = async (ctx: Context, next: () => Promise<any>) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status;
        if (!config.get('dev') && err.status === 500) {
            ctx.body = 'Internal Server Error';
        } else {
            ctx.body = err.message;
        }
        throw err;
    }
};
