import {server} from '../app';
import {config} from '../utils/configuration';
import {connectToDB} from '../actions/DAL/db-connector';
import {initiateSocketEvents} from '../sockets/socket-logic';

connectToDB().then(() => server.listen(config.get('port'))).then(() => initiateSocketEvents());
