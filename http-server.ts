import http = require("http");
import {routeRequest} from './router'

const port = 80;

const server = http.createServer(((req, res) => {
    routeRequest(req, res);
}));

server.listen(port);
console.info("Server listening on port: " + port);