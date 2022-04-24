const Sequelize = require('sequelize');
const moment = require('moment');
const { getPhotoUrl } = require('../util/userUtil');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const demand = require('../models/demand');
const priceRecord = require('../models/price_record');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');

const Op = Sequelize.Op;
const userModal = user(sequelize);
const priceRecordModal = priceRecord(sequelize);
const demandModal = demand(sequelize);

demandModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

const pagesize = 10;

module.exports = {
	// 查询所有需求
	getAllDemands: async (req, res) => {
		try {
			const { current, nickname, title, desc, play_id, instrument_id, voices_id } = req.query;
			const offset = Number((current - 1) * pagesize);
			const where = { is_delete: 1 };
			if (String(nickname).trim()) {
				where.nickname = {
					[Op.like]: `%${String(desc).trim()}%`,
				};
			}
			if (String(title).trim()) {
				where.title = {
					[Op.like]: `%${String(desc).trim()}%`,
				};
			}
			if (String(desc).trim()) {
				where.desc = {
					[Op.like]: `%${String(desc).trim()}%`,
				};
			}
			if (play_id && play_id !== '-1') {
				where.play_id = play_id;
			}
			if (instrument_id && instrument_id !== '-1') {
				where.instrument_id = instrument_id;
			}
			if (voices_id && voices_id !== '-1') {
				where.instrument_id = voices_id;
			}
			const commonFields = [
				'id',
				'user_id',
				'title',
				'type',
				'play_id',
				'instrument_id',
				'addressAll',
				'addressName',
				'desc',
				'price',
				'state',
				'create_time',
			];

			const demands = await demandModal.findAndCountAll({
				where,
				attributes: commonFields,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'photo', 'nickname', 'username', 'type'],
					},
				],
				order: [['create_time', 'DESC']],
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (!demands || !demands.rows || demands.rows.length === 0) {
				return res.send(resultMessage.success(result));
			}
			result.count = demands.count;
			result.list = responseUtil.renderFieldsAll(demands.rows, [...commonFields, 'userDetail']);
			if (result.list.length !== 0) {
				result.list.forEach((item) => {
					if (item.userDetail) {
						item.userid = item.userDetail.id;
						item.userPhoto = getPhotoUrl(item.userDetail.photo, item.userDetail.type);
						item.nickname = item.userDetail.nickname;
						item.username = item.userDetail.username;
						delete item.userDetail;
					}
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取需求详情
	getDetailById: async (req, res) => {
		try {
			const { id } = req.query;
			if (!id) return res.send(resultMessage.error('系统错误'));
			const commonFileds = [
				'id',
				'user_id',
				'join_ids',
				'title',
				'play_id',
				'instrument_id',
				'start_time',
				'end_time',
				'hours',
				'addressAll',
				'addressName',
				'is_bargain',
				'is_send',
				'is_food',
				'desc',
				'price',
				'state',
				'grade',
				'final_user_id',
				'final_price',
				'create_time',
			];
			let detail = await demandModal.findOne({
				where: { id },
				attributes: commonFileds,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'photo', 'nickname', 'username'],
					},
				],
			});
			if (!detail) return res.send(resultMessage.error('系统错误'));
			detail = responseUtil.renderFieldsObj(detail, [...commonFileds, 'userDetail']);
			if (detail && detail.userDetail) {
				detail.publisher_nickname = detail.userDetail.nickname;
				detail.publisher_username = detail.userDetail.username;
			}
			if (detail && detail.final_user_id) {
				const actorUser = await userModal.findOne({
					where: { id: detail.final_user_id },
					attributes: ['id', 'photo', 'nickname', 'username'],
				});
				if (actorUser) {
					detail.actor_id = actorUser.id;
					detail.actor_nickname = actorUser.nickname;
					detail.actor_username = actorUser.username;
				}
			}
			detail.start_time = moment(detail.start_time).format('YYYY-MM-DD');
			detail.end_time = moment(detail.end_time).format('YYYY-MM-DD');
			detail.create_time = moment(detail.create_time).format('YYYY-MM-DD HH:mm:ss');
			res.send(resultMessage.success(detail || {}));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除需求
	deleteDemand: async (req, res) => {
		try {
			const { demand_id } = req.body;
			if (!demand_id) return res.send(resultMessage.error('系统错误'));
			// 删除需求表中数据
			await demandModal.update({ is_delete: 2 }, { where: { id: demand_id } });
			// 删除报价记录
			await priceRecordModal.update({ is_delete: 2 }, { where: { demand_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
