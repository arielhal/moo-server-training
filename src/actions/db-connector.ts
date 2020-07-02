import {logger} from '../logger/logger';
import {config} from '../../configurations/configuration';
import mongoose = require('mongoose');

export const connectToDB = async () => {
    try {
        logger.info(config.get('dbURI'));
        await mongoose.connect(config.get('dbURI'), {
            useNewUrlParser: true,
            bufferCommands: false,
            useUnifiedTopology: true
        });
        logger.info('Connected successfully to DB!');
        const db = mongoose.connection;
        db.on('error', () => logger.error('DB connection error'));
        db.on('reconnect', () => logger.info('Reconnected to DB successfully'));
        db.on('reconnectFailed', () => logger.error('Reached maximal connection retries to DB'));
        db.on('disconnected', () => logger.error('Connection to DB is lost!'));
    } catch (err) {
        logger.error('Initial connection do DB failed!');
    }
};