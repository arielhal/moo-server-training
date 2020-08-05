import {app} from '../app';
import {config} from '../utils/configuration';
import {connectToDB} from '../actions/DAL/db-connector';


connectToDB().then(() =>
    app.listen(config.get('port')));