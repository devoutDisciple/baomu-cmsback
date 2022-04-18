const moment = require('moment');

console.log(moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'));
