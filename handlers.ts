import fs = require("fs");

const filePath = "file.txt";


async function getUpdateTime() {
    return new Promise((resolve, reject) => fs.stat(filePath, (err, stats) => {
            if (err) {
                return reject(err);
            }
            resolve(stats.mtime.toLocaleString())
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
    fs.readFile(filePath, 'utf8', ((err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end();
        } else {
            res.write(data.toUpperCase());
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