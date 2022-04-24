const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const skill = require('../models/skill');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');
const { getPhotoUrl } = require('../util/userUtil');

const userModal = user(sequelize);
const skillModal = skill(sequelize);
skillModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

const Op = Sequelize.Op;
const pagesize = 10;

module.exports = {
	// 获取用户技能
	getAll: async (req, res) => {
		try {
			const { current = 1, nickname, state } = req.query;
			const offset = Number((current - 1) * pagesize);
			const sillWhere = { is_delete: 1 };
			const userWhere = {};
			// 认证中
			if (Number(state) !== -1) {
				sillWhere.state = state;
			}
			if (String(nickname).trim()) {
				userWhere.nickname = {
					[Op.like]: `%${String(nickname).trim()}%`,
				};
			}
			const skills = await skillModal.findAndCountAll({
				where: sillWhere,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'username', 'photo', 'type'],
						where: userWhere,
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
			if (!skills || !skills.rows || skills.rows.length === 0) {
				return res.send(resultMessage.success(result));
			}
			result.count = skills.count;
			result.list = responseUtil.renderFieldsAll(skills.rows, ['id', 'skill_id', 'grade', 'state', 'userDetail', 'create_time']);
			if (result.list.length !== 0) {
				result.list.forEach((item) => {
					if (item.userDetail) {
						item.userPhoto = getPhotoUrl(item.userDetail.photo, item.userDetail.type);
						item.nickname = item.userDetail.nickname;
						item.username = item.userDetail.username;
						delete item.userDetail;
					}
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除技能
	deleteBySkillId: async (req, res) => {
		try {
			const { user_id, skill_id } = req.body;
			if (!user_id) return res.send(resultMessage.error('系统错误'));
			await skillModal.update({ is_delete: 2 }, { where: { user_id, skill_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 确定通过审核或者拒绝
	sureState: async (req, res) => {
		try {
			const { id, state } = req.body;
			if (!id || !state) {
				return res.send(resultMessage.error('系统错误'));
			}
			await skillModal.update({ state }, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
