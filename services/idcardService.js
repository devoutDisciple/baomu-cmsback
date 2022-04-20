const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const idcard = require('../models/idcard');
const responseUtil = require('../util/responseUtil');
const config = require('../config/config');

const timeformat = 'YYYY-MM-DD HH:mm:ss';

const idcardModal = idcard(sequelize);
const pagesize = 10;

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
			const body = req.body;
			if (!body.user_id || !body.idcard1 || !body.idcard2) {
				return res.send(resultMessage.error('系统错误'));
			}
			body.state = 2;
			body.create_time = moment().format(timeformat);
			await idcardModal.create(body);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户认证信息
	getAllByPage: async (req, res) => {
		try {
			const { current } = req.query;
			if (!current) return res.send(resultMessage.error('系统错误'));
			const offset = Number(current * pagesize);
			const idcards = await idcardModal.findOne({
				where: {
					is_delete: 1,
				},
				limit: pagesize,
				offset,
			});
			if (!idcards) return res.send(resultMessage.success({}));
			const result = responseUtil.renderFieldsAll(idcards, ['idcard1', 'idcard2', 'state']);
			if (result.length !== 0) {
				result.forEach((item) => {
					item.idcard1 = config.preUrl.idcardUrl + item.idcard1;
					item.idcard2 = config.preUrl.idcardUrl + item.idcard2;
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
