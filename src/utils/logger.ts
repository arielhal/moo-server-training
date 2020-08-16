import {createLogger, format, transports} from 'winston';

const {combine, printf} = format;

const myFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
    format: combine(
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss',
        }),
        myFormat
    ),
    transports: [new transports.Console(),
        new transports.File({filename: 'error.log', level: 'error'}),
        new transports.File({filename: 'combined.log'})]
});
