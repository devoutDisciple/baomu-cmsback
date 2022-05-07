const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const award = require('../models/award');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');
const config = require('../config/config');
const { getPhotoUrl } = require('../util/userUtil');

const userModal = user(sequelize);
const awardModal = award(sequelize);

awardModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
const pagesize = 10;

module.exports = {
	// 确定通过审核或者拒绝
	sureState: async (req, res) => {
		try {
			const { id, state, user_id } = req.body;
			if (!id || !state) {
				return res.send(resultMessage.error('系统错误'));
			}
			await awardModal.update({ state }, { where: { id } });
			const userState = state === 4 ? 1 : 2;
			await userModal.update({ is_school: userState, is_award: userState }, { where: { id: user_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户认证信息
	getAllByPage: async (req, res) => {
		try {
			const { current, type } = req.query;
			if (!current) return res.send(resultMessage.error('系统错误'));
			const offset = Number(Number(current - 1) * pagesize);
			const where = { is_delete: 1 };
			// 认证中
			if (Number(type) !== -1) {
				where.state = type;
			}
			const idcards = await awardModal.findAndCountAll({
				where,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'photo', 'nickname', 'username', 'type'],
					},
				],
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (!idcards || !idcards.rows || idcards.rows.length === 0) {
				return res.send(resultMessage.success(result));
			}
			result.count = idcards.count;
			result.list = responseUtil.renderFieldsAll(idcards.rows, [
				'id',
				'user_id',
				'award_url',
				'certificate_gov',
				'certificate_name',
				'certificate_level',
				'certificate_time',
				'state',
				'userDetail',
			]);
			if (result.list.length !== 0) {
				result.list.forEach((item) => {
					if (item.userDetail) {
						item.userid = item.userDetail.id;
						item.userPhoto = getPhotoUrl(item.userDetail.photo, item.userDetail.type);
						item.nickname = item.userDetail.nickname;
						item.username = item.userDetail.username;
					}
					item.award_url = config.preUrl.awardUrl + item.award_url;
					item.certificate_time = moment(item.certificate_time).format('YYYY-MM-DD');
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
					delete item.userDetail;
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};