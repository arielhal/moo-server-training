import {createLogger, format, transports} from 'winston';

const {combine, timestamp, printf} = format;

// tslint:disable-next-line:no-shadowed-variable
const myFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [new transports.Console(),
        new transports.File({filename: 'error.log', level: 'error'}),
        new transports.File({filename: 'combined.log'})]
});

export {logger};