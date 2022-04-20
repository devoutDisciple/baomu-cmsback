const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const wechatUtil = require('../util/wechatUtil');
const config = require('../config/config');
const demand = require('../models/demand');
const pay = require('../models/pay');

const payModal = pay(sequelize);
const demandModal = demand(sequelize);

const timeformat = 'YYYY-MM-DD HH:mm:ss';

module.exports = {
	// 议价确定，支付订单金额
	getPaySign: async (req, res) => {
		try {
			const { demand_id, open_id } = req.query;
			if (!demand_id || !open_id) return res.send(resultMessage.error('系统错误'));
			const attach = {
				demand_id,
			};
			let result = await wechatUtil.wechatPay({ money: 0.01, openId: open_id, attach, description: '支付需求费用' });
			result = {
				timeStamp: parseInt(`${+new Date() / 1000}`, 10).toString(),
				packageSign: result.package,
				paySign: result.paySign,
				nonceStr: result.nonceStr,
				appId: config.wx_appid,
				signType: 'RSA',
			};
			console.log(result, 1122);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 需求方支付，在议价确定之后，支付订单金额
	payByShoper: async (req, res) => {
		try {
			// open_id, user_id, demand_id: demand_id, pay_type: 1
			const { user_id, demand_id, open_id } = req.body;
			if (!demand_id || !open_id || !user_id) return res.send(resultMessage.error('系统错误'));
			const demandDetail = await demandModal.findOne({
				where: { id: demand_id },
				attribute: ['id', 'final_price'],
			});
			const attach = {
				demandId: demand_id,
				userId: user_id,
				type: 1, // 1-商户付款 2-付款给演员
				payType: 1, // 1-付款 2-退款 3-其他
			};
			let result = await wechatUtil.wechatPay({
				money: demandDetail.final_price,
				// money: 0.01,
				openId: open_id,
				attach,
				description: '支付需求费用',
			});
			result = {
				timeStamp: parseInt(`${+new Date() / 1000}`, 10).toString(),
				packageSign: result.package,
				paySign: result.paySign,
				nonceStr: result.nonceStr,
				appId: config.wx_appid,
				signType: 'RSA',
			};
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 处理微信付款回调
	handleWechatPay: async (req, res) => {
		try {
			const body = req.body;
			if (!body || !body.resource || !body.resource.ciphertext) {
				return {};
			}
			const result = await wechatUtil.getPayNotifyMsg(body);
			console.log(JSON.stringify(result), 11111);
			if (!result.out_trade_no || !result.transaction_id) {
				return res.send(resultMessage.error('系统错误'));
			}
			// 解密后的数据
			// {
			//     mchid: '1618427379',
			//     appid: 'wx768242fa111870e0',
			//     out_trade_no: 'AU9EA5G4FOBK1641908962009',商户系统内部订单号
			//     transaction_id: '4200001351202201114267927862', //微信支付订单号
			//     trade_type: 'JSAPI',
			//     trade_state: 'SUCCESS',
			//     trade_state_desc: '支付成功',
			//     bank_type: 'OTHERS',
			//     attach: '{"demandId":29,"userId":8,"type":1,"payType":1}',
			//     success_time: '2022-01-11T21:49:31+08:00',
			//     payer: { openid: 'odZ0M5iAUE3HxagunKf7kA7qbBBQ' },
			//     amount: { total: 2, payer_total: 2, currency: 'CNY', payer_currency: 'CNY' }
			//   }
			const attach = JSON.parse(result.attach);
			// {"demandId":29,"userId":8,"type":1,"payType":1}
			// 查询是否存在该账单
			const payRecode = await payModal.findOne({
				where: {
					user_id: attach.userId,
					open_id: result.payer.openid,
					out_trade_no: result.out_trade_no,
					transaction_id: result.transaction_id,
					type: attach.type,
					pay_type: attach.payType,
				},
			});
			if (payRecode) return res.send(resultMessage.success('success'));
			// 创建该账单
			await payModal.create({
				user_id: attach.userId,
				open_id: result.payer.openid,
				demand_id: attach.demandId,
				out_trade_no: result.out_trade_no,
				transaction_id: result.transaction_id,
				trade_state: result.trade_state,
				type: attach.type,
				pay_type: attach.payType,
				money: result.amount.payer_total,
				create_time: moment().format(timeformat),
			});
			// 更改需求状态 1-竞价进行中 2-竞价结束，需求进行中（未支付） 3-需求进行中（已支付） 4-需求取消  5-待付款给用户 6-交易成功 7-交易取消
			await demandModal.update({ state: 3 }, { where: { id: attach.demandId } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error('网络出小差了, 请稍后重试'));
		}
	},
};
