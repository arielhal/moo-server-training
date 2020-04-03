import nconf = require('nconf');

export const config = nconf.argv()
    .env()
    .file('./src/configurations/config.json');
