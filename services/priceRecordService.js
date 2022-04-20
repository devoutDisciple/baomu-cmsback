const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const demand = require('../models/demand');
const user = require('../models/user');
const priceRecord = require('../models/price_record');
const message = require('../models/message');
const responseUtil = require('../util/responseUtil');
const { getPhotoUrl } = require('../util/userUtil');

const messageModal = message(sequelize);
const priceRecordModal = priceRecord(sequelize);
const userModal = user(sequelize);
const demandModal = demand(sequelize);

demandModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

module.exports = {
	// 添加报价
	addPrice: async (req, res) => {
		try {
			const { user_id, publisher_id, price, demand_id, type, state, operation } = req.body;
			if (!(Number(String(price).trim()) > 0)) return res.send(resultMessage.success('系统错误'));
			if (!(Number(price) > 0)) return res.send(resultMessage.success('报价输入有误'));
			if (!user_id || !publisher_id || !price || !demand_id) return res.send(resultMessage.success('系统错误'));
			const demandDetail = await demandModal.findOne({ where: { id: demand_id } });
			// 1-竞价进行中 2-竞价结束未支付 3-需求进行中（必须已支付） 4-需求取消  5-交易成功 6-交易失败 7-交易取消
			if (!demandDetail || demandDetail.state !== 1) return res.send(resultMessage.success('系统错误'));
			const join_ids = demandDetail.join_ids;
			let joinArr = [];
			if (join_ids) {
				joinArr = join_ids.split(',');
			}
			if (!joinArr.includes(user_id)) {
				joinArr.push(user_id);
			}
			joinArr = Array.from(new Set(joinArr));
			const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
			// 更新需求的报价人员id
			await demandModal.update({ join_ids: joinArr.join(',') }, { where: { id: demand_id } });
			// 将以前该人员的报价设为拒绝
			await priceRecordModal.update({ state: 3 }, { where: { user_id, demand_id, publisher_id } });
			// 创建报价记录
			await priceRecordModal.create({
				user_id,
				demand_id,
				publisher_id,
				price,
				type,
				state,
				operation,
				create_time,
			});
			// 创建推送消息
			if (type === 1) {
				// 演员报价,推送给需求方
				await messageModal.create({
					person_id: publisher_id,
					user_id,
					content: JSON.stringify({ demand_id: demandDetail.id, user_id: publisher_id }),
					type: 3,
					create_time,
				});
			} else {
				// 需求方报价,推送给演员
				await messageModal.create({
					person_id: user_id,
					user_id: publisher_id,
					content: JSON.stringify({ demand_id: demandDetail.id, user_id: publisher_id }),
					type: 3,
					create_time,
				});
			}
			// 更新需求的竞价人员
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 根据需求id获取报价记录
	getPriceRecordByDemandId: async (req, res) => {
		try {
			const { demand_id } = req.query;
			if (!demand_id) return res.send(resultMessage.success('系统错误'));
			// const priceRecords = await priceRecordModal.findAll({
			// 	where: { demand_id },
			// 	order: [['create_time', 'ASC']],
			// 	include: [
			// 		{
			// 			model: userModal,
			// 			as: 'userDetail',
			// 			attributes: ['id', 'nickname', 'photo'],
			// 		},
			// 	],
			// });
			const statement = `select distinct user_id from price_record where demand_id = ${demand_id}`;
			const usersList = await sequelize.query(statement, { type: sequelize.QueryTypes.SELECT });
			const result = [];
			if (usersList && usersList.length !== 0) {
				const user_ids = usersList.map((item) => item.user_id);
				let len = user_ids.length;
				while (len > 0) {
					len -= 1;
					const curUserId = user_ids[len];
					const price_record_list = await priceRecordModal.findAll({
						where: { user_id: curUserId, demand_id },
						order: [['create_time', 'ASC']],
					});
					const priceList = responseUtil.renderFieldsAll(price_record_list, [
						'id',
						'publisher_id',
						'demand_id',
						'price',
						'type',
						'state',
						'create_time',
					]);
					priceList.forEach((item) => {
						item.create_time = moment(item.create_time).format('YYYY.MM.DD HH:mm');
					});
					let userDetail = await userModal.findOne({
						where: { id: curUserId },
						attributes: ['id', 'nickname', 'photo'],
					});
					userDetail = responseUtil.renderFieldsObj(userDetail, ['id', 'nickname', 'photo']);
					userDetail.photo = getPhotoUrl(userDetail.photo);
					result.unshift({
						userDetail,
						records: priceList,
					});
				}
			}
			console.log(result, 222);
			// 更新需求的竞价人员
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户的报价详情
	getPriceRecordByUserId: async (req, res) => {
		try {
			const { user_id, demand_id } = req.query;
			if (!demand_id) return res.send(resultMessage.success('系统错误'));
			const priceRecords = await priceRecordModal.findAll({
				where: { user_id, demand_id },
				order: [['create_time', 'ASC']],
			});
			const result = responseUtil.renderFieldsAll(priceRecords, [
				'id',
				'publisher_id',
				'demand_id',
				'price',
				'type',
				'state',
				'create_time',
			]);
			console.log(result, 222);
			// 更新需求的竞价人员
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 接受报价
	acceptPrice: async (req, res) => {
		try {
			const { id, demand_id } = req.body;
			if (!id || !demand_id) return res.send(resultMessage.success('系统错误'));
			// 更新此需求所有报价记录为拒绝
			await priceRecordModal.update({ state: 3 }, { where: { demand_id } });
			// 更新此条记录为接受报价
			await priceRecordModal.update({ state: 4 }, { where: { id } });
			// 查询该条报价详情
			const priceDetail = await priceRecordModal.findOne({ where: { id } });
			// 更新该条需求的最终确定人和最终价格，以及修改状态为竞价结束待支付
			await demandModal.update(
				{ final_user_id: priceDetail.user_id, final_price: priceDetail.price, state: 2 },
				{ where: { id: demand_id } },
			);
			const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
			// 创建推送消息
			if (priceDetail.type === 1) {
				// 需求方同意演员报价, 推送给演员
				messageModal.create({
					person_id: priceDetail.user_id,
					user_id: priceDetail.publisher_id,
					content: JSON.stringify({ demand_id: priceDetail.demand_id, user_id: priceDetail.publisher_id }),
					type: 3,
					create_time,
				});
			} else {
				// 演员同意需求方报价, 推送给需求方
				messageModal.create({
					person_id: priceDetail.publisher_id,
					user_id: priceDetail.user_id,
					content: JSON.stringify({ demand_id: priceDetail.demand_id, user_id: priceDetail.publisher_id }),
					type: 3,
					create_time,
				});
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 拒绝报价
	refusePrice: async (req, res) => {
		try {
			const { id } = req.body;
			if (!id) return res.send(resultMessage.success('系统错误'));
			// 更新此条记录为拒绝
			await priceRecordModal.update({ state: 3 }, { where: { id } });
			const priceDetail = await priceRecordModal.findOne({ where: { id } });
			const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
			// 创建推送消息
			if (priceDetail.type === 1) {
				// 演员报价,推送给需求方
				messageModal.create({
					person_id: priceDetail.publisher_id,
					user_id: priceDetail.user_id,
					content: JSON.stringify({ demand_id: priceDetail.demand_id, user_id: priceDetail.publisher_id }),
					type: 3,
					create_time,
				});
			} else {
				// 需求方报价,推送给演员
				messageModal.create({
					person_id: priceDetail.user_id,
					user_id: priceDetail.publisher_id,
					content: JSON.stringify({ demand_id: priceDetail.demand_id, user_id: priceDetail.publisher_id }),
					type: 3,
					create_time,
				});
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
