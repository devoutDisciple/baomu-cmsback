const moment = require('moment');

module.exports = {
	changeLog: () => {
		const log = console.log;
		console.log = (...rest) => {
			return log(`LOG: ${moment().format('YYYY-MM-DD HH:mm:ss')} ${rest}`);
		};
	},
	changeInfo: () => {
		const info = console.info;
		console.info = (...rest) => {
			info(`INFO: ${moment().format('YYYY-MM-DD HH:mm:ss')} ${rest}`);
			info(' ');
		};
	},

	changeError: () => {
		const error = console.error;
		console.error = (...rest) => {
			return error(`ERROR: ${moment().format('YYYY-MM-DD HH:mm:ss')} ${rest}`);
		};
	},
};
