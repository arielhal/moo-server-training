import nconf = require('nconf');

export const config = nconf.argv()
    .env()
    .file('./configurations/config.json');
