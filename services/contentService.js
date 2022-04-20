const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const content = require('../models/content');
const user = require('../models/user');
const userAttentionUser = require('../models/user_attention_user');
const userAttentionCircle = require('../models/content');
const responseUtil = require('../util/responseUtil');
const { getHotReply, handleContent } = require('../util/ObjectUtil');

const contentModal = content(sequelize);
const userAttentionUserModal = userAttentionUser(sequelize);
const userAttentionCircleModal = userAttentionCircle(sequelize);
const userModal = user(sequelize);
contentModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
const COMMONE_USER_FIELDS = ['id', 'photo', 'school', 'username', 'integral'];

const pagesize = 10;

const contentCommonFields = [
	'id',
	'user_id',
	'circle_ids',
	'circle_names',
	'topic_ids',
	'topic_names',
	'other_id',
	'type',
	'goods',
	'comment',
	'share',
	'create_time',
];

module.exports = {
	// 获取推荐内容
	getRecomment: async (req, res) => {
		try {
			// activeCircleId -圈子id
			const { user_id, current = 1, activeCircleId } = req.query;
			let condition = {};
			// 这是推荐
			if (activeCircleId === 'recommend') {
				condition = { is_delete: 1 };
			} else {
				condition = [sequelize.fn('FIND_IN_SET', activeCircleId, sequelize.col('circle_ids')), { is_delete: 1 }];
			}
			const offset = Number((current - 1) * pagesize);
			const contentList = await contentModal.findAll({
				where: condition,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: COMMONE_USER_FIELDS,
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
			});
			const result = [];
			if (contentList && contentList.length !== 0) {
				let len = contentList.length;
				while (len > 0) {
					len -= 1;
					const obj = responseUtil.renderFieldsObj(contentList[len], [...contentCommonFields, 'userDetail']);
					const content_id = contentList[len].id;
					let newObj = {};
					if (user_id) {
						// 添加帖子或者pk的详情
						newObj = await handleContent(obj, user_id);
						newObj.hotReply = await getHotReply(content_id, user_id);
					} else {
						newObj = await handleContent(obj);
						obj.hotReply = await getHotReply(content_id);
					}
					result.unshift(newObj);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取内容详情
	getContentDetail: async (req, res) => {
		try {
			const { content_id, user_id } = req.query;
			if (!content_id) return res.send(resultMessage.error());
			const contentDetail = await contentModal.findOne({
				where: {
					id: content_id,
					is_delete: 1,
				},
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: COMMONE_USER_FIELDS,
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
			});
			if (!contentDetail) return res.send(resultMessage.error('暂无数据'));
			const obj = responseUtil.renderFieldsObj(contentDetail, [...contentCommonFields, 'userDetail']);
			const result = await handleContent(obj, user_id);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户发布的东西
	getContentsByUserId: async (req, res) => {
		try {
			const { user_id, current = 1 } = req.query;
			const offset = Number((current - 1) * pagesize);
			if (!user_id) return res.send(resultMessage.error('请先登录'));
			const userDetail = await userModal.findOne({ where: { id: user_id }, attributes: COMMONE_USER_FIELDS });
			const contentList = await contentModal.findAll({
				where: {
					user_id,
					is_delete: 1,
				},
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
			});
			const result = [];
			if (contentList && contentList.length !== 0) {
				let len = contentList.length;
				while (len > 0) {
					len -= 1;
					contentList[len].userDetail = responseUtil.renderFieldsObj(userDetail, COMMONE_USER_FIELDS);
					const obj = responseUtil.renderFieldsObj(contentList[len], [...contentCommonFields, 'userDetail']);
					const content_id = contentList[len].id;
					// 添加帖子或者pk的详情
					const newObj = await handleContent(obj, user_id);
					newObj.hotReply = await getHotReply(content_id, user_id);
					result.unshift(newObj);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户帖子或者博客
	getContentsByTypeAndUserId: async (req, res) => {
		try {
			const { user_id, current = 1, activeIdx } = req.query;
			const offset = Number((current - 1) * pagesize);
			let type = [1];
			switch (String(activeIdx)) {
				// 获取文字
				case '0':
					type = [1, 2, 3, 4, 6];
					break;
				// 获取视频
				case '1':
					type = [5];
					break;
				// 获取相册
				case '2':
					type = [3, 4];
					break;
				default:
					type = [1];
					break;
			}
			if (!user_id) return res.send(resultMessage.error('请先登录'));
			const userDetail = await userModal.findOne({ where: { id: user_id }, attributes: COMMONE_USER_FIELDS });
			const contentList = await contentModal.findAll({
				where: {
					user_id,
					is_delete: 1,
					type,
				},
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
			});
			const result = [];
			if (contentList && contentList.length !== 0) {
				let len = contentList.length;
				while (len > 0) {
					len -= 1;
					contentList[len].userDetail = responseUtil.renderFieldsObj(userDetail, COMMONE_USER_FIELDS);
					const obj = responseUtil.renderFieldsObj(contentList[len], [...contentCommonFields, 'userDetail']);
					const content_id = contentList[len].id;
					// 查看帖子或者pk的详情
					const newObj = await handleContent(obj, user_id);
					newObj.hotReply = await getHotReply(content_id, user_id);
					result.unshift(newObj);
				}
			}
			const threeDays = []; // 三天内的
			const monthDays = []; // 一个月内的
			const longago = []; // 更早以前的
			result.forEach((item) => {
				const diffDays = moment(new Date()).diff(moment(item.create_time), 'days');
				if (diffDays < 3) {
					threeDays.push(item);
				} else if (diffDays < 30) {
					monthDays.push(item);
				} else {
					longago.push(item);
				}
			});
			res.send(
				resultMessage.success({
					threeDays,
					monthDays,
					longago,
				}),
			);
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 根据圈子获取不同种类的数据
	getContentsByCircleAndType: async (req, res) => {
		try {
			const { circle_id, current = 1, activeIdx, user_id } = req.query;
			const offset = Number((current - 1) * pagesize);
			let type = [1];
			switch (String(activeIdx)) {
				// 获取帖子
				case '0':
					type = [1];
					break;
				// 获取博客
				case '1':
					type = [2];
					break;
				// 获取投票pk
				case '2':
					type = [3, 4];
					break;
				// 获取视频
				case '3':
					type = [5];
					break;
				default:
					type = [1];
					break;
			}
			if (!circle_id) return res.send(resultMessage.error());
			const condition = [sequelize.fn('FIND_IN_SET', circle_id, sequelize.col('circle_ids')), { is_delete: 1, type }];
			const contentList = await contentModal.findAll({
				where: condition,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: COMMONE_USER_FIELDS,
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
			});
			const contents = [];
			if (contentList && Array.isArray(contentList)) {
				contentList.forEach((item) => {
					contents.push(responseUtil.renderFieldsObj(item, [...contentCommonFields, 'userDetail']));
				});
			}
			const result = [];
			if (contents && contents.length !== 0) {
				let len = contents.length;
				while (len > 0) {
					len -= 1;
					const obj = responseUtil.renderFieldsObj(contents[len], [...contentCommonFields, 'userDetail']);
					const content_id = contents[len].id;
					let newObj = {};
					// 添加帖子或者pk的详情
					if (user_id) {
						newObj = await handleContent(obj, user_id);
						newObj.hotReply = await getHotReply(content_id, user_id);
					} else {
						newObj = await handleContent(obj);
						newObj.hotReply = await getHotReply(content_id);
					}
					result.unshift(newObj);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户关注的人发布的内容
	getUserAttentionContents: async (req, res) => {
		try {
			// activeCircleId -圈子id
			const { user_id, current = 1 } = req.query;
			const attentionUsers = await userAttentionUserModal.findAll({ where: { user_id, is_delete: 1 } });
			const attentionUsersId = attentionUsers.map((item) => item.other_id);
			const attentionCircles = await userAttentionCircleModal.findAll({ where: { user_id, is_delete: 1 } });
			const attentionCirclesId = attentionCircles.map((item) => item.circle_id);
			const offset = Number((current - 1) * pagesize);
			const str1 =
				'SELECT content.id, content.user_id, content.circle_ids, content.circle_names, content.topic_ids, content.topic_names, content.other_id, content.type, content.goods, content.comment, content.share, content.create_time, ';
			const str2 =
				"userDetail.id AS 'user_detail_id', userDetail.username AS 'user_detail_username', userDetail.photo AS 'user_detail_photo', userDetail.integral AS 'user_detail_integral', userDetail.school AS 'user_detail_school' ";
			const str3 = 'FROM content  LEFT OUTER JOIN user AS userDetail ON content.user_id = userDetail.id ';
			let str4 = `WHERE content.is_delete = 1 `;
			if (attentionUsersId && attentionUsersId.length !== 0) {
				str4 += `AND (content.user_id IN (${attentionUsersId.join(',')}) `;
			}
			if (attentionUsersId && attentionUsersId.length !== 0 && attentionCirclesId && attentionCirclesId.length !== 0) {
				str4 += 'OR ';
			}
			if ((!attentionUsersId || attentionUsersId.length === 0) && attentionCirclesId && attentionCirclesId.length !== 0) {
				str4 += 'AND ';
			}
			if (attentionCirclesId && attentionCirclesId.length !== 0) {
				str4 += `CONCAT(',', circle_ids, ',') REGEXP ',(${attentionCirclesId.join('|')}),' `;
			}
			if (attentionUsersId && attentionUsersId.length !== 0) {
				str4 += `) `;
			}
			str4 += `ORDER BY content.create_time DESC LIMIT ${offset}, ${pagesize};`;
			const statement = str1 + str2 + str3 + str4;
			console.log(statement, 111);
			const contentList = await sequelize.query(statement, { type: sequelize.QueryTypes.SELECT });
			const result = [];
			if (contentList && contentList.length !== 0) {
				let len = contentList.length;
				while (len > 0) {
					len -= 1;
					const currItem = contentList[len];
					if (currItem && currItem.user_detail_id) {
						currItem.userDetail = {
							id: currItem.user_detail_id,
							username: currItem.user_detail_username,
							photo: currItem.user_detail_photo,
							school: currItem.user_detail_school,
							integral: currItem.user_detail_integral,
						};
					}
					const obj = responseUtil.renderFieldsObj(currItem, [...contentCommonFields, 'userDetail']);
					const content_id = currItem.id;
					let newObj = {};
					if (user_id) {
						// 添加帖子或者pk的详情
						newObj = await handleContent(obj, user_id);
						newObj.hotReply = await getHotReply(content_id, user_id);
					} else {
						newObj = await handleContent(obj);
						obj.hotReply = await getHotReply(content_id);
					}
					result.unshift(newObj);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
