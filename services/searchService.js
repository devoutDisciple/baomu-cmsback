const Sequelize = require('sequelize');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const content = require('../models/content');
const config = require('../config/config');
const responseUtil = require('../util/responseUtil');
const { getHotReply, handleContent } = require('../util/commonService');
const circle = require('../models/circle');
const posts = require('../models/posts');
const vote = require('../models/vote');
const video = require('../models/video');
const battle = require('../models/battle');
const userAttentionCircle = require('../models/user_attention_circle');
const userAttentionUser = require('../models/user_attention_user');
const user = require('../models/user');

const Op = Sequelize.Op;
const contentModal = content(sequelize);
const userModal = user(sequelize);
const circleModal = circle(sequelize);
const postsModal = posts(sequelize);
const voteModal = vote(sequelize);
const battleModal = battle(sequelize);
const videoModal = video(sequelize);
const userAttentionUsereModal = userAttentionUser(sequelize);
const userAttentionCircleModal = userAttentionCircle(sequelize);
contentModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
contentModal.belongsTo(postsModal, { foreignKey: 'other_id', targetKey: 'id', as: 'postDetail' });
contentModal.belongsTo(voteModal, { foreignKey: 'other_id', targetKey: 'id', as: 'voteDetail' });
contentModal.belongsTo(battleModal, { foreignKey: 'other_id', targetKey: 'id', as: 'battleDetail' });
contentModal.belongsTo(videoModal, { foreignKey: 'other_id', targetKey: 'id', as: 'videoDetail' });

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

const MAX_LIMIT = 30;

module.exports = {
	// 模糊搜索博客帖子
	getTxtContents: async (req, res) => {
		try {
			const { user_id, keywords } = req.query;
			const contentList = await contentModal.findAll({
				where: {
					is_delete: 1,
					type: [1, 2],
				},
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
					{
						model: postsModal,
						as: 'postDetail',
						attributes: ['id', 'title', 'desc', 'img_urls'],
						where: {
							[Op.or]: {
								title: {
									[Op.like]: `%${keywords}%`,
								},
								desc: {
									[Op.like]: `%${keywords}%`,
								},
							},
						},
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: MAX_LIMIT,
				offset: 0,
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
						newObj = await handleContent(obj, user_id);
						newObj.hotReply = await getHotReply(content_id, user_id);
					} else {
						newObj = await handleContent(obj);
						newObj.hotReply = await getHotReply(content_id);
					}
					// 添加帖子或者pk的详情
					result.unshift(newObj);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 模糊搜索投票
	getVoteContents: async (req, res) => {
		try {
			const { user_id, keywords } = req.query;
			const contentList = await contentModal.findAll({
				where: {
					is_delete: 1,
					type: 3,
				},
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
					{
						model: voteModal,
						as: 'voteDetail',
						attributes: ['id', 'title', 'total', 'type', 'content'],
						where: {
							[Op.or]: {
								title: {
									[Op.like]: `%${keywords}%`,
								},
								content: {
									[Op.like]: `%${keywords}%`,
								},
							},
						},
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: MAX_LIMIT,
				offset: 0,
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
						newObj = await handleContent(obj, user_id);
						newObj.hotReply = await getHotReply(content_id, user_id);
					} else {
						newObj = await handleContent(obj);
						newObj.hotReply = await getHotReply(content_id);
					}
					// 添加帖子或者pk的详情
					result.unshift(newObj);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 模糊搜索PK
	getBattleContents: async (req, res) => {
		try {
			const { user_id, keywords } = req.query;
			const contentList = await contentModal.findAll({
				where: {
					is_delete: 1,
					type: 4,
				},
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
					{
						model: battleModal,
						as: 'battleDetail',
						attributes: [
							'id',
							'title',
							'red_name',
							'red_ticket',
							'red_url',
							'blue_name',
							'blue_ticket',
							'blue_url',
							'dead_time',
						],
						where: {
							[Op.or]: {
								title: {
									[Op.like]: `%${keywords}%`,
								},
								red_name: {
									[Op.like]: `%${keywords}%`,
								},
								blue_name: {
									[Op.like]: `%${keywords}%`,
								},
							},
						},
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: MAX_LIMIT,
				offset: 0,
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
						newObj = await handleContent(obj, user_id);
						newObj.hotReply = await getHotReply(content_id, user_id);
					} else {
						newObj = await handleContent(obj);
						newObj.hotReply = await getHotReply(content_id);
					}
					// 添加帖子或者pk的详情
					result.unshift(newObj);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 模糊搜索视频
	getVideoContents: async (req, res) => {
		try {
			const { user_id, keywords } = req.query;
			const contentList = await contentModal.findAll({
				where: {
					is_delete: 1,
					type: 5,
				},
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
					{
						model: videoModal,
						as: 'videoDetail',
						attributes: ['id', 'url', 'desc', 'photo'],
						where: {
							desc: {
								[Op.like]: `%${keywords}%`,
							},
						},
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: MAX_LIMIT,
				offset: 0,
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
						newObj = await handleContent(obj, user_id);
						newObj.hotReply = await getHotReply(content_id, user_id);
					} else {
						newObj = await handleContent(obj);
						newObj.hotReply = await getHotReply(content_id);
					}
					// 添加帖子或者pk的详情
					result.unshift(newObj);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 模糊搜索圈子
	getCircles: async (req, res) => {
		try {
			const { keywords, user_id } = req.query;
			const circles = await circleModal.findAll({
				where: {
					is_delete: 1,
					name: {
						[Op.like]: `%${keywords}%`,
					},
				},
				order: [['hot', 'DESC']],
				attributes: ['id', 'name', 'hot', 'blogs', 'posts', 'vote', 'battle', 'videos', 'logo'],
				limit: MAX_LIMIT,

				offset: 0,
			});
			const result = [];
			let len = circles.length;
			while (len > 0) {
				len -= 1;
				const curItem = circles[len];
				const txtNum = Number(
					Number(curItem.blogs) + Number(curItem.posts) + Number(curItem.vote) + Number(curItem.battle),
				).toFixed(0);
				const tempObj = responseUtil.renderFieldsObj(curItem, [
					'id',
					'name',
					'desc',
					'fellow',
					'videos',
					'hot',
					'type',
					'logo',
					'bg_url',
				]);
				tempObj.hadAttention = false;
				tempObj.txtNum = txtNum || 0;
				tempObj.logo = config.preUrl.circleUrl + tempObj.logo;
				if (user_id) {
					const attentionDetail = await userAttentionCircleModal.findOne({
						where: { user_id, circle_id: tempObj.id, is_delete: 1 },
					});
					if (attentionDetail) tempObj.hadAttention = true;
				}
				result.push(tempObj);
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 模糊搜索用户
	getUsers: async (req, res) => {
		try {
			const { keywords, user_id } = req.query;
			const users = await userModal.findAll({
				where: {
					is_delete: 1,
					username: {
						[Op.like]: `%${keywords}%`,
					},
					id: {
						[Op.not]: user_id,
					},
				},
				order: [['integral', 'DESC']],
				attributes: ['id', 'username', 'photo', 'fans', 'fellow', 'publish', 'integral', 'school'],
				limit: MAX_LIMIT,
				offset: 0,
			});
			const result = [];
			let len = users.length;
			while (len > 0) {
				len -= 1;
				const curItem = users[len];
				const tempObj = responseUtil.renderFieldsObj(curItem, [
					'id',
					'username',
					'photo',
					'fans',
					'fellow',
					'publish',
					'integral',
					'school',
				]);
				tempObj.hadAttention = false;
				tempObj.photo = config.preUrl.photoUrl + tempObj.photo;
				if (user_id) {
					const attentionDetail = await userAttentionUsereModal.findOne({
						where: { user_id, other_id: tempObj.id, is_delete: 1 },
					});
					if (attentionDetail) tempObj.hadAttention = true;
				}
				result.push(tempObj);
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
