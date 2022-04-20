const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const school = require('../models/school');
const responseUtil = require('../util/responseUtil');
const config = require('../config/config');

const timeformat = 'YYYY-MM-DD HH:mm:ss';

const schoolModal = school(sequelize);

module.exports = {
	// 上传图片
	uploadFile: async (req, res, filename) => {
		try {
			res.send(resultMessage.success({ url: filename }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 添加
	add: async (req, res) => {
		try {
			const data = req.body;
			if (
				!data.user_id ||
				!data.school_url ||
				!data.award_url ||
				!data.name ||
				!data.idcard ||
				!data.school_name ||
				!data.graduation_time ||
				!data.study_id ||
				!data.certificate_gov ||
				!data.certificate_name ||
				!data.certificate_level ||
				!data.certificate_time
			) {
				return res.send(resultMessage.error('系统错误'));
			}
			data.state = 2;
			data.create_time = moment().format(timeformat);
			await schoolModal.create(data);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户认证信息
	getAll: async (req, res) => {
		try {
			const { user_id } = req.query;
			if (!user_id) return res.send(resultMessage.error('系统错误'));
			const levels = await schoolModal.findOne({ where: { user_id, is_delete: 1 } });
			if (!levels) return res.send(resultMessage.success([]));
			const result = responseUtil.renderFieldsObj(levels, [
				'user_id',
				'school_url',
				'award_url',
				'name',
				'idcard',
				'school_name',
				'graduation_time',
				'study_id',
				'certificate_gov',
				'certificate_name',
				'certificate_level',
				'certificate_time',
				'state',
			]);
			if (result) {
				result.school_url = config.preUrl.schoolUrl + result.school_url;
				result.award_url = config.preUrl.schoolUrl + result.award_url;
				result.graduation_time = moment(result.date).format('YYYY-MM-DD');
				result.certificate_time = moment(result.date).format('YYYY-MM-DD');
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
