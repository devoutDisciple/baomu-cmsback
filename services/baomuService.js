const WxPay = require('wechatpay-node-v3');
const fs = require('fs');
const path = require('path');
const resultMessage = require('../util/resultMessage');
const ObjectUtil = require('../util/ObjectUtil');
const wechatUtil = require('../util/wechatUtil');
const config = require('../config/config');

module.exports = {
	// 支付
	pay: async (req, res) => {
		try {
			const { openid } = req.body;
			// 使用框架
			const pay = new WxPay({
				appid: config.wx_appid,
				mchid: config.wechat_mchid,
				publicKey: fs.readFileSync(path.join(__dirname, '../wechatPayCert/apiclient_cert.pem')), // 公钥
				privateKey: fs.readFileSync(path.join(__dirname, '../wechatPayCert/apiclient_key.pem')), // 秘钥
			});
			const params = {
				// 订单编号
				out_trade_no: `${ObjectUtil.getRandomStr(12)}${new Date().getTime()}`,
				notify_url: 'https://www.chiangjiaoyu.com/pay',
				amount: {
					total: Number(Number(1).toFixed(0)), // 单位分
					currency: 'CNY',
				},
				payer: { openid },
				description: '支付',
			};
			let result = await pay.transactions_jsapi(params);
			console.log(JSON.stringify(result), 1111);
			result = {
				timeStamp: parseInt(`${+new Date() / 1000}`, 10).toString(),
				packageSign: result.package,
				paySign: result.paySign,
				nonceStr: result.nonceStr,
				appId: result.appId,
				signType: 'RSA',
			};
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	getLogin: async (req, res) => {
		try {
			const { code } = req.body;
			const result = await wechatUtil.getUserSessionKeyByBaoMu(code);
			res.send(resultMessage.success({ openid: result.openid }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
