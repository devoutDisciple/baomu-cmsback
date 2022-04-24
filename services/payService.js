const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const pay = require('../models/pay');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');
const { getPhotoUrl } = require('../util/userUtil');

const userModal = user(sequelize);
const payModal = pay(sequelize);

payModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
const Op = Sequelize.Op;
const pagesize = 10;

module.exports = {
	// 获取支付的记录
	getPayList: async (req, res) => {
		try {
			const { current, type, nickname, pay_type } = req.query;
			if (!current) return res.send(resultMessage.error('系统错误'));
			const offset = Number(Number(current - 1) * pagesize);
			const payWhere = { is_delete: 1 };
			const userWhere = {};
			if (Number(type) !== -1) {
				payWhere.type = type;
			}
			if (Number(pay_type) !== -1) {
				payWhere.pay_type = pay_type;
			}
			if (String(nickname).trim()) {
				userWhere.nickname = {
					[Op.like]: `%${String(nickname).trim()}%`,
				};
			}
			const pays = await payModal.findAndCountAll({
				where: payWhere,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'photo', 'nickname', 'username', 'type'],
						where: userWhere,
					},
				],
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (!pays || !pays.rows || pays.rows.length === 0) {
				return res.send(resultMessage.success(result));
			}
			result.count = pays.count;
			result.list = responseUtil.renderFieldsAll(pays.rows, [
				'id',
				'user_id',
				'type',
				'pay_type',
				'trade_state',
				'money',
				'userDetail',
				'create_time',
			]);
			if (result.list.length !== 0) {
				result.list.forEach((item) => {
					if (item.userDetail) {
						item.userid = item.userDetail.id;
						item.userPhoto = getPhotoUrl(item.userDetail.photo, item.userDetail.type);
						item.nickname = item.userDetail.nickname;
						item.username = item.userDetail.username;
						delete item.userDetail;
					}
					item.money = Number(Number(item.money) / 100).toFixed(2);
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
