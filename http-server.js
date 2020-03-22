const http = require('http');
const fs = require('fs');
const filePath = 'file.txt'

let server = http.createServer(((req, res) => {
    if (req.method == 'GET') {
        if (req.url == '/content') {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            fs.readFile(filePath, 'utf8', ((err, data) => {
                if (err)
                    throw err;
                res.write(data.toUpperCase());
                res.end();
            }));
        } else if (req.url == '/updateTime') {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            fs.stat(filePath, ((err, stats) => {
                res.write(stats.mtime.toLocaleString());
                res.end();
            }));
        } else {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            });
            res.end("Bad request!");
        }
    } else {
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        });
        res.end('Bad request!');
    }
}));

server.listen(80);