const moment = require('moment');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const project = require('../models/project');
const responseUtil = require('../util/responseUtil');

const projectModal = project(sequelize);
const pagesize = 10;

const commonFields = ['id', 'name', 'type_id', 'sort'];
module.exports = {
	// 获取所有班级
	getAllProjectByTypeId: async (req, res) => {
		try {
			const { current = 1, typeid } = req.query;
			if (!typeid) return res.send(resultMessage.success([]));
			const condition = { is_delete: 1 };
			if (typeid) {
				condition.type_id = typeid;
			}
			const offset = Number((current - 1) * pagesize);
			const swipers = await projectModal.findAndCountAll({
				where: condition,
				attributes: commonFields,
				order: [['sort', 'DESC']],
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (swipers && swipers.rows && swipers.rows.length !== 0) {
				result.count = swipers.count;
				result.list = responseUtil.renderFieldsAll(swipers.rows, commonFields);
				result.list.forEach((item) => {
					item.crate_time = moment(item.crate_time).format('YYYY-MM-DD HH:mm:ss');
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 新增
	addProject: async (req, res) => {
		try {
			const { typeid, name, sort } = req.body;
			await projectModal.create({
				type_id: typeid,
				name,
				sort,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除
	deleteById: async (req, res) => {
		try {
			const { id } = req.body;
			await projectModal.update({ is_delete: 2 }, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 根据type获取所有课程类别  getAllPorjectByType
	getAllPorjectByType: async (req, res) => {
		try {
			const { typeId } = req.query;
			const projects = await projectModal.findAll({
				where: { type_id: typeId, is_delete: 1 },
				order: [['sort', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(projects, ['id', 'name']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
