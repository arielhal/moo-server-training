import fs = require("fs");

const filePath = "file.txt";


async function getUpdateTime() {
    return new Promise((resolve, reject) => fs.stat(filePath, (err, stats) => {
            if (err) {
                return reject(err);
            }
            resolve(stats.mtime.toLocaleString());
        }
    ));
}

async function sendUpdateTime(req, res) {
    try {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        let time = await getUpdateTime();
        res.write(time);
        res.end();
    } catch (err) {
        console.error(err);
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end();
    }
}

function sendContent(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    fs.readFile(filePath, ((err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end();
        } else {
            // @ts-ignore
            for (const value of data) {
                res.write(String.fromCharCode(value).toUpperCase());
            }
            res.end();
        }
    }));
}

function undefinedRequest(req, res) {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    res.end();
}

export {sendContent, sendUpdateTime, undefinedRequest};