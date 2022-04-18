// const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const subject = require('../models/subject');
const detail = require('../models/detail');
const project = require('../models/project');
const responseUtil = require('../util/responseUtil');
const config = require('../config/config');

const projectModal = project(sequelize);
const subjectModal = subject(sequelize);
const detailModal = detail(sequelize);

subjectModal.belongsTo(projectModal, { foreignKey: 'project_id', targetKey: 'id', as: 'projectDetail' });

const pagesize = 10;
// const Op = Sequelize.Op;

const contentCommonFields = [
	'id',
	'project_id',
	'title',
	'teacher_ids',
	'price',
	'start_time',
	'end_time',
	'apply_price',
	'cluster_price',
	'total_person',
	'apply_num',
	'cluster_num',
	'limit_num',
	'state',
	'tags',
	'sort',
	'create_time',
];

const detailCommonFields = ['id', 'url', 'detail_urls', 'teacher_urls', 'signup_urls', 'sub_id'];

module.exports = {
	// 分页获取内容
	getAllSubjectsByContions: async (req, res) => {
		try {
			const { current = 1, projectid } = req.query;
			const condition = { is_delete: 1 };
			const order = [['create_time', 'DESC']];
			if (projectid) {
				condition.project_id = projectid;
			}
			const offset = Number((current - 1) * pagesize);
			const contents = await subjectModal.findAndCountAll({
				where: condition,
				order,
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
				include: [
					{
						model: projectModal,
						as: 'projectDetail',
						attributes: ['id', 'name', 'type_id'],
					},
				],
			});
			const result = {
				count: 0,
				list: [],
			};
			if (contents && contents.rows && contents.rows.length !== 0) {
				result.count = contents.count;
				result.list = responseUtil.renderFieldsAll(contents.rows, [...contentCommonFields, 'userDetail', 'projectDetail']);
				result.list.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
					item.start_time = moment(item.start_time).format('YYYY.MM.DD');
					item.end_time = moment(item.end_time).format('YYYY.MM.DD');
				});
			}
			console.log(result, 2222);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 新增课程
	addSubject: async (req, res) => {
		try {
			const data = req.body;
			const prams = {
				apply_price: data.apply_price,
				cluster_price: data.cluster_price,
				end_time: data.end_time,
				limit_num: data.limit_num,
				price: data.price,
				project_id: data.projectid,
				start_time: data.start_time,
				title: data.title,
				teacher_ids: JSON.stringify(data.teacher_ids),
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			};
			const result = await subjectModal.create(prams);
			await detailModal.create({ sub_id: result.id, create_time: moment().format('YYYY-MM-DD HH:mm:ss') });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 编辑课程
	editSubject: async (req, res) => {
		try {
			const data = req.body;
			const params = {
				apply_price: data.apply_price,
				cluster_price: data.cluster_price,
				end_time: data.end_time,
				limit_num: data.limit_num,
				price: data.price,
				project_id: data.projectid,
				start_time: data.start_time,
				title: data.title,
				teacher_ids: JSON.stringify(data.teacher_ids),
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			};
			await subjectModal.update(params, { where: { id: data.id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	addTags: async (req, res) => {
		try {
			const { id, tags } = req.body;
			await subjectModal.update({ tags: JSON.stringify(tags) }, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除内容
	deleteById: async (req, res) => {
		try {
			const { subjectId } = req.body;
			await subjectModal.update({ is_delete: 2 }, { where: { id: subjectId } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取详情
	getDetailById: async (req, res) => {
		try {
			const { id } = req.query;
			if (!id) return res.send(resultMessage.error());
			const subjectDetail = await detailModal.findOne({ where: { sub_id: id, is_delete: 1 }, attributes: detailCommonFields });
			const result = responseUtil.renderFieldsObj(subjectDetail, detailCommonFields);
			if (result && result.length !== 0) {
				result.detail_urls = JSON.parse(result.detail_urls);
				result.signup_urls = JSON.parse(result.signup_urls);
				result.teacher_urls = JSON.parse(result.teacher_urls);
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传图片
	uploadFile: async (req, res, filename) => {
		try {
			const filePath = config.preUrl.subjectUrl + filename;
			res.send(resultMessage.success(filePath));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 修改详情图片
	updateDetailImgs: async (req, res) => {
		try {
			const { detailId, urls, detail_urls, signup_urls, teacher_urls } = req.body;
			detailModal.update(
				{
					url: urls,
					detail_urls: JSON.stringify(detail_urls),
					signup_urls: JSON.stringify(signup_urls),
					teacher_urls: JSON.stringify(teacher_urls),
				},
				{ where: { id: detailId } },
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
