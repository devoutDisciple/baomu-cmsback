const Sequelize = require('sequelize');
const moment = require('moment');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const user = require('../models/user');
const production = require('../models/production');
const pay = require('../models/pay');
const team = require('../models/team');
const responseUtil = require('../util/responseUtil');
const ObjectUtil = require('../util/ObjectUtil');
const calculate = require('../util/calculate');

const productionModel = production(sequelize);
const userModel = user(sequelize);
const teamModel = team(sequelize);
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
			// 总团队数量
			const totalTeams = (await teamModel.count({ where: { is_delete: 1 } })) || 0;
			// 今日新增团队数量
			const todayTeams =
				(await teamModel.count({
					where: {
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			// 总作品或者状态数量
			const totalProductions = (await productionModel.count({ where: { is_delete: 1 } })) || 0;
			// 今日报名人数
			const todayProductions =
				(await productionModel.count({
					where: {
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			// 商户付款金额
			let dealMoney = (await payModel.sum('money', { where: { type: 1, is_delete: 1 } })) || 0;
			dealMoney = Number(calculate.div(dealMoney, 100)).toFixed(2);
			let todayDealMoney =
				(await payModel.sum('money', {
					where: {
						type: 1,
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			todayDealMoney = Number(calculate.div(todayDealMoney, 100)).toFixed(2);
			// 企业付款金额
			let companyMoney = (await payModel.sum('money', { where: { type: 2, is_delete: 1 } })) || 0;
			companyMoney = Number(calculate.div(companyMoney, 100)).toFixed(2);
			let todayCompanyMoney =
				(await payModel.sum('money', {
					where: {
						type: 2,
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			todayCompanyMoney = Number(calculate.div(todayCompanyMoney, 100)).toFixed(2);

			let refundMoney = (await payModel.sum('money', { where: { type: 3, is_delete: 1 } })) || 0;
			refundMoney = Number(calculate.div(refundMoney, 100)).toFixed(2);
			let todayRefundMoney =
				(await payModel.sum('money', {
					where: {
						type: 3,
						is_delete: 1,
						create_time: {
							[Op.gte]: todayTime,
						},
					},
				})) || 0;
			todayRefundMoney = Number(calculate.div(todayRefundMoney, 100)).toFixed(2);

			res.send(
				resultMessage.success({
					totalUsers,
					todayUsers,
					totalProductions,
					todayProductions,
					totalTeams,
					todayTeams,
					dealMoney,
					todayDealMoney,
					companyMoney,
					todayCompanyMoney,
					refundMoney,
					todayRefundMoney,
				}),
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取用户增长记录数据
	getUserData: async (req, res) => {
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
					type: 1,
				},
			});
			const result = ObjectUtil.countNumByTime(responseUtil.renderFieldsAll(users, ['id', 'create_time']));
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 团队增长曲线
	getTeamData: async (req, res) => {
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
					type: 2,
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
	getMoneyData: async (req, res) => {
		try {
			const { startTime, endTime } = req.query;
			const users = await payModel.findAll({
				order: [['create_time', 'ASC']],
				attributes: ['id', 'money', 'create_time'],
				where: {
					create_time: {
						[Op.gte]: moment(startTime).format(startTimeFormat),
						[Op.lte]: moment(endTime).format(endTimeFormat),
					},
				},
			});
			const result = ObjectUtil.countMoneyByTime(responseUtil.renderFieldsAll(users, ['id', 'money', 'create_time']));
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取作品增长曲线
	getProductionData: async (req, res) => {
		try {
			const { startTime, endTime } = req.query;
			const users = await productionModel.findAll({
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
};
