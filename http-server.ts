import http = require('http');
import {routeRequest} from './router'
import settings from './config.json';


const port = settings.port;

const server = http.createServer(((req, res) => {
    routeRequest(req, res);
}));

server.listen(port);
console.info('Server listening on port: ' + port);