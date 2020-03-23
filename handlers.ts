import fs = require('fs');
import {IncomingMessage, ServerResponse} from 'http';
import settings from './config.json';
const filePath = settings.filePath;


const getUpdateTime = () => {
    return new Promise((resolve, reject) => fs.stat(filePath, (err, stats) => {
            if (err) {
                return reject(err);
            }
            resolve(stats.mtime.toLocaleString());
        }
    ));
};

const sendUpdateTime = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        const time = await getUpdateTime();
        res.write(time);
        res.end();
    } catch (err) {
        console.error(err);
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end('Internal Server Error!');
    }
};

const sendContent = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    fs.readFile(filePath, ((err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end('Internal Server Error!');
        } else {
            // @ts-ignore
            for (const value of data) {
                res.write(String.fromCharCode(value).toUpperCase());
            }
            res.end();
        }
    }));
};

const undefinedRequest = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    res.end('Not Found!');
};

export {sendContent, sendUpdateTime, undefinedRequest};