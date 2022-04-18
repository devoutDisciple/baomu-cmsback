const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const teacher = require('../models/teacher');
const responseUtil = require('../util/responseUtil');
const config = require('../config/config');

const teacherModal = teacher(sequelize);
const pagesize = 10;

const contentCommonFields = ['id', 'name', 'photo'];

module.exports = {
	// 获取所有老师
	getAllTeacher: async (req, res) => {
		try {
			const { current = 1, projectid } = req.query;
			const condition = { is_delete: 1 };
			const order = [['create_time', 'DESC']];
			if (projectid) {
				condition.project_id = projectid;
			}
			const offset = Number((current - 1) * pagesize);
			const contents = await teacherModal.findAndCountAll({
				where: condition,
				order,
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (contents && contents.rows && contents.rows.length !== 0) {
				result.count = contents.count;
				result.list = responseUtil.renderFieldsAll(contents.rows, contentCommonFields);
				result.list.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取所有老师(不分页)
	getAllTeachers: async (req, res) => {
		try {
			const condition = { is_delete: 1 };
			const order = [['create_time', 'DESC']];
			const teachers = await teacherModal.findAll({
				where: condition,
				order,
				attributes: contentCommonFields,
			});
			const result = responseUtil.renderFieldsAll(teachers, contentCommonFields);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	deleteById: async (req, res) => {
		try {
			const { id } = req.body;
			await teacherModal.update({ is_delete: 2 }, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传图片
	uploadFile: async (req, res, filename) => {
		try {
			const filePath = config.preUrl.photoUrl + filename;
			res.send(resultMessage.success(filePath));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 新增老师
	addTeacher: async (req, res) => {
		try {
			const { name, photo } = req.body;
			await teacherModal.create({ name, photo, create_time: moment().format('YYYY-MM-DD HH:mm:ss') });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
