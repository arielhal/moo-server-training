import {server} from '../app';
import {config} from '../utils/configuration';
import {connectToDB} from '../actions/DAL/db-connector';


connectToDB().then(() => server.listen(config.get('port')));
