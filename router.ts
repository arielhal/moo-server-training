import {sendContent, sendUpdateTime, undefinedRequest} from './handlers';
import {IncomingMessage, ServerResponse} from 'http';

const routes : {[index: string]: (res: IncomingMessage, req: ServerResponse) => void} = {
    '/content': sendContent,
    '/updateTime': sendUpdateTime
};


const routeRequest = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'GET' && routes[req.url]) {
        console.info('Got ' + req.url + ' request from: ' + req.connection.remoteAddress);
        routes[req.url](req, res);
    } else {
        undefinedRequest(req, res);
        console.warn('Got undefined request: ' + req.url + ' from: ' + req.connection.remoteAddress);
    }
};

export {routeRequest};
