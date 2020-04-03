import {createLogger, format, transports} from 'winston';
import {Context} from 'koa';

const {combine, timestamp, printf} = format;

// tslint:disable-next-line:no-shadowed-variable
const myFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
    format: combine(
        timestamp({
            format: 'DD-MM-YYYY HH:mm:ss',
        }),
        myFormat
    ),
    transports: [new transports.Console(),
        new transports.File({filename: 'error.log', level: 'error'}),
        new transports.File({filename: 'combined.log'})]
});

export const loggerMiddleware = async (ctx: Context, next: () => Promise<any>) => {
    logger.info(`got ${ctx.request.method}: ${ctx.request.path} request from ${ctx.request.ip}`);
    try {
        await next();
    } catch (err) {
        logger.error(`Client: ${ctx.request.ip}, status: ${err.status}, message: ${err.message}`);
    }
};
