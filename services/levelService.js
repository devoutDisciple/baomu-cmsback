const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const level = require('../models/level');
const responseUtil = require('../util/responseUtil');
const config = require('../config/config');

const timeformat = 'YYYY-MM-DD HH:mm:ss';

const levelModal = level(sequelize);

module.exports = {
	// 上传图片
	uploadFile: async (req, res, filename) => {
		try {
			const { user_id, school_id, level_id, date } = req.body;
			await levelModal.create({
				user_id,
				school_id,
				level_id,
				date: moment(date).format(timeformat),
				url: filename,
				state: 2,
				create_time: moment().format(timeformat),
			});
			res.send(resultMessage.success({ url: filename }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户考级
	getAll: async (req, res) => {
		try {
			const { user_id } = req.query;
			if (!user_id) return res.send(resultMessage.error('系统错误'));
			const levels = await levelModal.findOne({ where: { user_id, is_delete: 1 } });
			if (!levels) return res.send(resultMessage.success([]));
			const result = responseUtil.renderFieldsObj(levels, ['school_id', 'level_id', 'date', 'url', 'state']);
			if (result) {
				result.url = config.preUrl.levelUrl + result.url;
				result.date = moment(result.date).format('YYYY-MM-DD');
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
			await levelModal.update({ is_delete: 2 }, { where: { user_id, skill_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
