const Sequelize = require('sequelize');
const moment = require('moment');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const user = require('../models/user');
const order = require('../models/order');
const pay = require('../models/pay');
const responseUtil = require('../util/responseUtil');
const ObjectUtil = require('../util/ObjectUtil');

const orderModel = order(sequelize);
const userModel = user(sequelize);
const payModel = pay(sequelize);

const Op = Sequelize.Op;
const startTimeFormat = 'YYYY-MM-DD 00:00:00';
const endTimeFormat = 'YYYY-MM-DD 23:59:59';

module.exports = {
	// 获取统计数据
	getTotal: async (req, res) => {
		try {
			const todayTime = moment(new Date()).format('YYYY-MM-DD 00:00') || 0;
			// 用户总数
			const totalUsers = (await userModel.count({ where: { is_delete: 1 } })) || 0;
			// 今日新增用户数
			const todayUsers =
				(await userModel.count({
					where: {
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			// 总报名数
			const totalSignup = (await orderModel.count({ where: { type: 1, is_delete: 1 } })) || 0;
			// 今日报名人数
			const todaySignup =
				(await orderModel.count({
					where: {
						type: 1,
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			// 总组团人数
			const totalTeams = (await orderModel.count({ where: { type: 2, is_delete: 1 } })) || 0;
			// 今日报名人数
			const todayTeams =
				(await orderModel.count({
					where: {
						type: 2,
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			// 总收入
			let totalMoney = (await payModel.sum('money', { where: { pay_type: 1, is_delete: 1 } })) || 0;
			if (totalMoney) totalMoney = (totalMoney / 100).toFixed(2);
			// 今天收入
			let todayMoney =
				(await payModel.sum('money', {
					where: {
						pay_type: 1,
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			if (todayMoney) todayMoney = (todayMoney / 100).toFixed(2);

			res.send(
				resultMessage.success({
					totalUsers,
					todayUsers,
					totalSignup,
					todaySignup,
					totalTeams,
					todayTeams,
					totalMoney,
					todayMoney,
				}),
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取用户增长记录数据
	getUserNumData: async (req, res) => {
		try {
			const { startTime, endTime } = req.query;
			const users = await userModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'create_time'],
				where: {
					create_time: {
						[Op.gte]: moment(startTime).format(startTimeFormat),
						[Op.lte]: moment(endTime).format(endTimeFormat),
					},
				},
			});
			const result = ObjectUtil.countNumByTime(responseUtil.renderFieldsAll(users, ['id', 'create_time']));
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取收入曲线
	getSalesData: async (req, res) => {
		try {
			const { startTime, endTime } = req.query;
			const users = await payModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'pay_type', 'money', 'create_time'],
				where: {
					create_time: {
						[Op.gte]: moment(startTime).format(startTimeFormat),
						[Op.lte]: moment(endTime).format(endTimeFormat),
					},
					pay_type: 1,
				},
			});
			const result = ObjectUtil.countMoneyByTime(responseUtil.renderFieldsAll(users, ['id', 'pay_type', 'money', 'create_time']));
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 报名人数
	getSignupData: async (req, res) => {
		try {
			const { startTime, endTime } = req.query;
			const datas = await orderModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'type', 'pay_state'],
				where: {
					create_time: {
						[Op.gte]: moment(startTime).format(startTimeFormat),
						[Op.lte]: moment(endTime).format(endTimeFormat),
					},
					type: 1,
					is_delete: 1,
				},
			});
			const result = ObjectUtil.countNumByTime(responseUtil.renderFieldsAll(datas, ['id', 'type', 'pay_state']));
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 组团人数
	getTeamData: async (req, res) => {
		try {
			const { startTime, endTime } = req.query;
			const datas = await orderModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'type', 'pay_state'],
				where: {
					create_time: {
						[Op.gte]: moment(startTime).format(startTimeFormat),
						[Op.lte]: moment(endTime).format(endTimeFormat),
					},
					type: 2,
					is_delete: 1,
				},
			});
			const result = ObjectUtil.countNumByTime(responseUtil.renderFieldsAll(datas, ['id', 'type', 'pay_state']));
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
