import {sendContent, sendUpdateTime, undefinedRequest} from './handlers'

const routeHandlers = {
    "/content": sendContent,
    "/updateTime": sendUpdateTime
};


function routeRequest(req, res) {
    if (req.method == 'GET' && routeHandlers[req.url]) {
        console.info("Got " + req.url + " request from: " + req.connection.remoteAddress);
        routeHandlers[req.url](req, res);
    } else {
        undefinedRequest(req, res);
        console.warn("Got undefined request: " + req.url + " from: " + req.connection.remoteAddress);
    }
}

export {routeRequest};
