import {Context} from 'koa';
import {config} from '../../configurations/configuration';

export const errorHandlerMiddleware = async (ctx: Context, next: () => Promise<any>) => {
    try {
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
        throw err;
    }
};
