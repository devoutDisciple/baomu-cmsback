const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const demandEvaluate = require('../models/demand_evaluate');
const demand = require('../models/demand');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');
const { getPhotoUrl } = require('../util/userUtil');

const timeformat = 'YYYY-MM-DD HH:mm:ss';

const userModal = user(sequelize);
const demandModal = demand(sequelize);
const demandEvaluateModal = demandEvaluate(sequelize);

demandEvaluateModal.belongsTo(userModal, { foreignKey: 'publisher_id', targetKey: 'id', as: 'userDetail' });

module.exports = {
	// 增加评论
	addEvaluate: async (req, res) => {
		try {
			const { user_id, demand_id, publisher_id, grade, desc } = req.body;
			if (!user_id || !demand_id || !publisher_id || !grade) {
				return res.send(resultMessage.error('系统错误'));
			}
			// 增加评价记录
			await demandEvaluateModal.create({
				user_id,
				demand_id,
				publisher_id,
				grade,
				desc,
				create_time: moment().format(timeformat),
			});
			// 改变需求的状态为已评价，并且更新该需求评分
			await demandModal.update({ state: 7, grade }, { where: { id: demand_id } });
			// 更改用户的评分
			const userDetail = await userModal.findOne({ where: { id: user_id }, attributes: ['id', 'grade'] });
			if (userDetail) {
				const avg_grade = Number(Number(userDetail.grade) + Number(grade)) / 2;
				await userModal.update({ grade: avg_grade }, { where: { id: userDetail.id } });
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取个人全部评价
	getAllEvaluatesByUserId: async (req, res) => {
		try {
			const { user_id } = req.query;
			if (!user_id) {
				return res.send(resultMessage.error('系统错误'));
			}
			const demandEvaluateDetails = await demandEvaluateModal.findAll({
				where: { user_id },
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'photo'],
					},
				],
			});
			if (!demandEvaluateDetails) return res.send(resultMessage.success([]));
			const result = responseUtil.renderFieldsAll(demandEvaluateDetails, [
				'id',
				'demand_id',
				'user_id',
				'publisher_id',
				'grade',
				'desc',
				'create_time',
				'userDetail',
			]);
			result.forEach((item) => {
				item.grade = Number(item.grade).toFixed(1);
				item.userDetail.photo = getPhotoUrl(item.userDetail.photo);
				item.create_time = moment(item.create_time).format('YYYY.MM.DD');
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取评价详情
	getEvaluateDetailById: async (req, res) => {
		try {
			const { demand_id } = req.query;
			if (!demand_id) {
				return res.send(resultMessage.error('系统错误'));
			}
			const demandEvaluateDetail = await demandEvaluateModal.findOne({
				where: { demand_id },
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'photo'],
					},
				],
			});
			if (!demandEvaluateDetail) return res.send(resultMessage.success({}));
			const result = responseUtil.renderFieldsObj(demandEvaluateDetail, [
				'id',
				'demand_id',
				'user_id',
				'publisher_id',
				'grade',
				'desc',
				'create_time',
				'userDetail',
			]);
			result.userDetail.photo = getPhotoUrl(result.userDetail.photo);
			result.create_time = moment(result.create_time).format('YYYY.MM.DD');
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
