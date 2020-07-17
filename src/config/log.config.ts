//import bunyan from 'bunyan';
import path from 'path';
const bunyan = require('bunyan');

export const AppLog = bunyan.createLogger({
	name: 'troopmate',
	streams: [
		{
			level: 'info',
			path: path.join(__dirname + '/info.log')            // log INFO and above to stdout
		},
		{
			level: 'warn',
			path: path.join(__dirname + '/info.log')            // log INFO and above to stdout
		},
		{
			level: 'error',
			path: path.join(__dirname + '/info.log')            // log INFO and above to stdout
		}
	]

});