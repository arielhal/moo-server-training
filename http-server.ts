import Koa = require('koa');
import {router} from './router';
import mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected successfuly to DB, todo logs'));


const app = new Koa();

app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(80);