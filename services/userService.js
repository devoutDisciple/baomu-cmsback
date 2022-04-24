const Sequelize = require('sequelize');
const moment = require('moment');
const userUtil = require('../util/userUtil');
const sequelize = require('../dataSource/MysqlPoolClass');
const user = require('../models/user');
const production = require('../models/production');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');

const Op = Sequelize.Op;
const productionModal = production(sequelize);
const userModal = user(sequelize);

// userAttentionModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
// goodsRecordModal.belongsTo(contentModal, { foreignKey: 'content_id', targetKey: 'id', as: 'contentDetail' });
const pagesize = 10;
const commonFields = [
	'id',
	'nickname',
	'username',
	'phone',
	'bg_url',
	'photo',
	'grade',
	'type',
	'comment_num',
	'goods_num',
	'is_name',
	'is_school',
	'is_award',
	'is_level',
	'province',
	'city',
	'address',
	'play_id',
	'style_id',
	'create_time',
];

module.exports = {
	// 根据分页获取用户信息
	getUsersByPage: async (req, res) => {
		try {
			const { current = 1, nickname, phone, startTime, endTime } = req.query;
			const condition = { is_delete: 1, type: 1 };
			if (nickname) {
				condition.nickname = {
					[Op.like]: `%${nickname}%`,
				};
			}
			if (phone) {
				condition.phone = {
					[Op.like]: `%${phone}%`,
				};
			}
			if (startTime) {
				condition.create_time = {
					[Op.gte]: startTime,
				};
			}
			if (endTime) {
				condition.create_time = {
					[Op.lte]: `%${endTime}%`,
				};
			}
			const offset = Number((current - 1) * pagesize);
			const users = await userModal.findAndCountAll({
				where: condition,
				order: [['create_time', 'DESC']],
				attributes: commonFields,
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (users && users.rows && users.rows.length !== 0) {
				result.count = users.count;
				result.list = responseUtil.renderFieldsAll(users.rows, commonFields);
				result.list.forEach((item) => {
					item.photo = userUtil.getPhotoUrl(item.photo, item.type);
					item.create_time = item.create_time ? moment(item.create_time).format('YYYY-MM-DD HH:mm') : '';
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 查询个人信息详情
	getUserDetail: async (req, res) => {
		try {
			const userFields = [
				'id',
				'wx_openid',
				'nickname',
				'username',
				'photo',
				'bg_url',
				'phone',
				'type',
				'grade',
				'comment_num',
				'attention_num',
				'fans_num',
				'goods_num',
				'is_name',
				'is_school',
				'is_award',
				'is_level',
				'province',
				'city',
				'address',
				'play_id',
				'style_id',
				'desc',
				'create_time',
			];
			const { user_id } = req.query;
			const users = await userModal.findOne({ where: { id: user_id, is_delete: 1 } });
			if (!users) return res.send(resultMessage.error('暂无此用户'));
			const productionNum = await productionModal.count({ where: { is_delete: 1, type: 1 } });
			const actionNum = await productionModal.count({ where: { is_delete: 1, type: 2 } });
			const detail = responseUtil.renderFieldsObj(users, userFields);
			detail.photo = userUtil.getPhotoUrl(detail.photo, detail.type);
			detail.create_time = detail.create_time ? moment(detail.create_time).format('YYYY-MM-DD HH:mm') : '';
			detail.productionNum = productionNum || 0;
			detail.actionNum = actionNum || 0;
			res.send(resultMessage.success(detail));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 修改个人信息
	updateMsg: async (req, res) => {
		try {
			const { user_id, data } = req.body;
			const userDetail = await userModal.findOne({ where: { id: user_id, disable: 1, is_delete: 1 } });
			if (!userDetail) return res.send(resultMessage.error('暂无此用户'));
			await userModal.update(data, { where: { id: user_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
