import Koa = require('koa');
import {router} from './router';
import bodyParser = require('koa-bodyparser');
import mongoose = require('mongoose');
import {logger} from './logger';
import nconf = require('nconf');

nconf.file('./config.json');

mongoose.connect(nconf.get('dbURI'), {
    useNewUrlParser: true,
    reconnectTries: nconf.get('reconnectTriesDB'),
    reconnectInterval: nconf.get('reconnectIntervalDB'),
    bufferCommands: false
}).catch(() => {
    logger.error('Initial connection do DB failed!');
});
const db = mongoose.connection;
db.on('error', () => logger.error('DB connection error'));
db.once('open', () => logger.info('Connected successfully to DB!'));
db.on('reconnect', () => logger.info('Reconnected to DB successfully'));
db.on('reconnectFailed', () => logger.error('Reached maximal connection retries to DB'));
db.on('disconnected', () => logger.error('Connection to DB was lost!'));


const app = new Koa();

app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(nconf.get('port'));
logger.info('Server is listening on port: ' + nconf.get('port'));