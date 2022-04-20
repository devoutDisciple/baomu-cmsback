const resultMessage = require('../util/resultMessage');

module.exports = {
	// 上传视频
	upload: async (req, res, filename) => {
		try {
			res.send(resultMessage.success({ url: filename }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
