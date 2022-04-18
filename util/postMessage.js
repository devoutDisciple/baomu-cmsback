const Core = require('@alicloud/pop-core');
const config = require('../config/config');

const requestOption = {
	method: 'POST',
};

const client = new Core({
	accessKeyId: config.message_accessKeySecret,
	accessKeySecret: config.message_accessKeySecret,
	endpoint: config.message_endpoint,
	apiVersion: config.message_apiVersion,
});

const RegionId = 'cn-hangzhou';

module.exports = {
	// 发送验证信息
	postLoginMessage: (phoneNum, code) => {
		if (config.send_message_flag === 2) return;
		const params = {
			RegionId,
			PhoneNumbers: phoneNum,
			SignName: config.notify_message_sign,
			TemplateCode: config.message_loginyanzhengma,
			TemplateParam: JSON.stringify({ code }),
		};
		return new Promise((resolve, reject) => {
			client.request('SendSms', params, requestOption).then(
				(result) => {
					console.log(JSON.stringify(result));
					resolve({ phoneNum, code });
				},
				(ex) => {
					reject('发送失败');
					console.log(ex);
				},
			);
		});
	},

	// 随机的验证码
	getMessageCode: () => {
		const numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		let str = '';
		for (let i = 0; i < 6; i++) {
			const random = Math.floor(Math.random() * numArr.length);
			str += numArr[random];
		}
		return str;
	},
};
