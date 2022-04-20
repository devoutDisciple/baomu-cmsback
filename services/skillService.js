const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const skill = require('../models/skill');
const responseUtil = require('../util/responseUtil');

const skillModal = skill(sequelize);

module.exports = {
	// 添加技能
	addSkill: async (req, res) => {
		try {
			const { data } = req.body;
			const params = [];
			data.forEach((item) => {
				params.push({
					user_id: item.user_id,
					skill_id: item.skill_id,
					grade: item.grade,
					create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
					is_delete: 1,
				});
			});
			await skillModal.bulkCreate(params);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户技能
	getAll: async (req, res) => {
		try {
			const { user_id } = req.query;
			if (!user_id) return res.send(resultMessage.error('系统错误'));
			const skills = await skillModal.findAll({ where: { user_id, is_delete: 1 } });
			if (!skills) return res.send(resultMessage.success([]));
			const result = responseUtil.renderFieldsAll(skills, ['skill_id', 'grade']);
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
};
