const config = require('../config/config');

module.exports = {
	getPhotoUrl: (name) => {
		if (!name) return config.default_photo_url;
		if (name.includes('https://thirdwx.qlogo.cn')) {
			return name;
		}
		return config.preUrl.photoUrl + name;
	},
};
