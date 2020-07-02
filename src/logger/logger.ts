import {createLogger, format, transports} from 'winston';

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
