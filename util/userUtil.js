const config = require('../config/config');

module.exports = {
	getPhotoUrl: (name, type) => {
		if (!name) return '';
		// type 1-个人 2-乐队
		if (Number(type) === 2) return config.preUrl.teamUrl + name;
		if (name.includes('https://thirdwx.qlogo.cn')) {
			return name;
		}
		return config.preUrl.photoUrl + name;
	},
};
