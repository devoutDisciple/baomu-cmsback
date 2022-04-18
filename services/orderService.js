const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const order = require('../models/order');
const user = require('../models/user');
const project = require('../models/project');
const team = require('../models/team');

const subject = require('../models/subject');
const responseUtil = require('../util/responseUtil');

const teamModal = team(sequelize);
const userModal = user(sequelize);
const projectModal = project(sequelize);
const subjectModal = subject(sequelize);
const orderModal = order(sequelize);
const { filterTeamState } = require('../constant/constant');

const pagesize = 10;
const Op = Sequelize.Op;

orderModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
orderModal.belongsTo(projectModal, { foreignKey: 'project_id', targetKey: 'id', as: 'projectDetail' });
orderModal.belongsTo(subjectModal, { foreignKey: 'subject_id', targetKey: 'id', as: 'subjectDetail' });
orderModal.belongsTo(teamModal, { foreignKey: 'team_uuid', targetKey: 'uuid', as: 'teamDetail' });

const contentCommonFields = [
	'id',
	'user_id',
	'team_uuid',
	'subject_id',
	'project_id',
	'pay_state',
	'type',
	'english',
	'math',
	'sex',
	'time',
	'name',
	'create_time',
];

module.exports = {
	// 分页获取内容
	getAllOrderByConditions: async (req, res) => {
		try {
			const { current = 1, start_time, end_time } = req.query;
			const condition = { is_delete: 1 };
			if (start_time && end_time) {
				condition.create_time = {
					[Op.gte]: start_time,
					[Op.lte]: end_time,
				};
			}
			const offset = Number((current - 1) * pagesize);
			const contents = await orderModal.findAndCountAll({
				where: condition,
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'phone', 'photo'],
					},
					{
						model: projectModal,
						as: 'projectDetail',
						attributes: ['id', 'name', 'type_id'],
					},
					{
						model: subjectModal,
						as: 'subjectDetail',
						attributes: ['id', 'title'],
					},
					{
						model: teamModal,
						as: 'teamDetail',
						attributes: ['id', 'order_ids', 'user_ids', 'start_user_id', 'num', 'state'],
					},
				],
			});
			const result = {
				count: 0,
				list: [],
			};
			if (contents && contents.rows && contents.rows.length !== 0) {
				result.count = contents.count;
				result.list = responseUtil.renderFieldsAll(contents.rows, [
					...contentCommonFields,
					'userDetail',
					'projectDetail',
					'subjectDetail',
					'teamDetail',
				]);
				result.list.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
					item.time = item.time ? moment(item.time).format('YYYY-MM-DD') : '';
					if (item.teamDetail) {
						item.teamDetail = responseUtil.renderFieldsObj(item.teamDetail, [
							'id',
							'num',
							'order_ids',
							'start_user_id',
							'state',
							'user_ids',
						]);
						item.teamDetail.teamState = filterTeamState(item.teamDetail.state);
					}
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
