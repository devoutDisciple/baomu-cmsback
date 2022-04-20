const Sequelize = require('sequelize');
const moment = require('moment');
const userUtil = require('../util/userUtil');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const goodsRecord = require('../models/goods_record');
const commentRecord = require('../models/comment_record');
const user = require('../models/user');
const production = require('../models/production');
const config = require('../config/config');

const Op = Sequelize.Op;
const goodsRecordModal = goodsRecord(sequelize);
const commentRecordModal = commentRecord(sequelize);
const userModal = user(sequelize);
const productionModal = production(sequelize);
const timeformat = 'YYYY-MM-DD HH:mm:ss';
goodsRecordModal.belongsTo(productionModal, { foreignKey: 'content_id', targetKey: 'id', as: 'contentDetail' });
goodsRecordModal.belongsTo(commentRecordModal, { foreignKey: 'comment_id', targetKey: 'id', as: 'commentDetail' });
goodsRecordModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
commentRecordModal.belongsTo(productionModal, { foreignKey: 'content_id', targetKey: 'id', as: 'contentDetail' });
commentRecordModal.belongsTo(commentRecordModal, { foreignKey: 'comment_id', targetKey: 'id', as: 'commentDetail' });

const { handleContent } = require('../util/commonService');
const responseUtil = require('../util/responseUtil');

const pagesize = 10;
module.exports = {
	// 给帖子点赞
	addPostsGoods: async (req, res) => {
		try {
			const { user_id, other_id, content_id, goods_type } = req.body;
			const goodsDetail = await goodsRecordModal.findOne({
				where: {
					user_id,
					content_id,
					type: 1,
				},
			});
			// 此时这条记录存在，应该删除这个记录
			if (goodsDetail) {
				goodsRecordModal.destroy({ where: { id: goodsDetail.id } });
			} else {
				goodsRecordModal.create({
					user_id,
					other_id,
					content_id,
					type: 1,
					create_time: moment().format(timeformat),
				});
			}
			if (goods_type) {
				// 给帖子增加赞 热度 + 1
				productionModal.increment({ goods_num: 1, hot: 1 }, { where: { id: content_id } });
				// 用户点赞
				userModal.increment({ goods_num: 1 }, { where: { id: user_id } });
			} else {
				// 给帖子取消赞 热度 - 1
				productionModal.decrement({ goods_num: 1, hot: 1 }, { where: { id: content_id } });
				// 用户点赞
				userModal.decrement({ goods_num: 1 }, { where: { id: user_id } });
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 查看用户是否给帖子点过赞
	getUserProductionGoods: async (req, res) => {
		try {
			const { user_id, content_id } = req.query;
			const goodsDetail = await goodsRecordModal.findOne({
				where: {
					user_id,
					content_id,
					type: 1,
				},
			});
			// 1-标识存在 2-不存子啊
			let hadGoods = 1;
			// 此时这条记录存在，应该删除这个记录
			if (goodsDetail) {
				hadGoods = 1;
			} else {
				hadGoods = 2;
			}
			res.send(resultMessage.success(hadGoods));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 给评论点赞
	addReplyGoods: async (req, res) => {
		try {
			const { user_id, other_id, content_id, comment_id, goods_type, type } = req.body;
			const conditions = {
				user_id,
				other_id,
				content_id,
				type,
			};
			if (type !== 1) {
				conditions.comment_id = comment_id;
			}
			const goodsDetail = await goodsRecordModal.findOne({
				where: conditions,
			});
			// 此时这条记录存在，应该删除这个记录
			if (goodsDetail) {
				goodsRecordModal.destroy({ where: { id: goodsDetail.id } });
			} else {
				conditions.create_time = moment().format(timeformat);
				goodsRecordModal.create(conditions);
			}
			if (goods_type) {
				// 评论的点赞 + 1
				await commentRecordModal.increment({ goods_num: 1 }, { where: { id: comment_id } });
				// 帖子热度 + 1
				await productionModal.increment({ hot_num: 1 }, { where: { id: content_id } });
				// 用户点赞数量 + 1
				await userModal.increment({ goods_num: 1 }, { where: { id: user_id } });
			} else {
				// 评论的点赞 + 1
				await commentRecordModal.decrement({ goods_num: 1 }, { where: { id: comment_id } });
				// 帖子热度 - 1
				await productionModal.decrement({ hot_num: 1 }, { where: { id: content_id } });
				// 用户点赞数量 - 1
				await userModal.decrement({ goods_num: 1 }, { where: { id: user_id } });
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 查看获取了多少赞
	getGoodsNumByUserId: async (req, res) => {
		try {
			const { user_id } = req.query;
			if (!user_id) return res.send(resultMessage.error('请先登录'));
			// 获取多少赞
			const goodsNum = await goodsRecordModal.count({ where: { user_id } });
			res.send(resultMessage.success({ goodsNum }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户获得了多少赞
	getMyGoodsNumByUser: async (req, res) => {
		try {
			const { user_id, time } = req.query;
			if (!user_id || !time) return res.send(resultMessage.error('请先登录'));
			// 查看我发布的帖子获得了多少赞
			let goodsNum = await goodsRecordModal.count({
				where: {
					type: 1,
					other_id: user_id,
					create_time: {
						[Op.gte]: time,
					},
				},
			});
			goodsNum = Number(goodsNum).toFixed(0);
			res.send(resultMessage.success({ goodsNum }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取用户获得了多少评论
	getCommentsNumByUser: async (req, res) => {
		try {
			const { user_id, time } = req.query;
			if (!user_id || !time) return res.send(resultMessage.error('请先登录'));
			// 给帖子的评论
			const contentsComNum = await commentRecordModal.count({
				where: {
					type: 1,
					create_time: {
						[Op.gte]: time,
					},
				},
				include: [
					{
						model: productionModal,
						as: 'contentDetail',
						attributes: ['id', 'user_id', 'content_id'],
						where: {
							user_id,
						},
					},
				],
			});
			// 给评论的评论
			const commentsComNum = await commentRecordModal.count({
				where: {
					type: 2,
					create_time: {
						[Op.gte]: time,
					},
				},
				include: [
					{
						model: commentRecordModal,
						as: 'commentDetail',
						attributes: ['id', 'user_id', 'content_id'],
						where: { user_id },
					},
				],
			});
			const commentsNum = Number(contentsComNum + commentsComNum).toFixed(0);
			res.send(resultMessage.success({ commentsNum }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 分页获取用户点赞的内容的详情
	getGoodsDetailByUser: async (req, res) => {
		try {
			const goodsFields = ['id', 'user_id', 'other_id', 'type', 'content_id', 'comment_id', 'create_time'];
			const { user_id, current = 1 } = req.query;
			const offset = Number((current - 1) * pagesize);
			// 赞
			const goods = await goodsRecordModal.findAll({
				where: {
					user_id,
				},
				attributes: goodsFields,
				order: [['create_time', 'DESC']],
				limit: pagesize,
				offset,
			});
			const result = [];
			if (goods && goods.length !== 0) {
				let len = goods.length;
				while (len > 0) {
					len -= 1;
					const currItem = responseUtil.renderFieldsObj(goods[len], goodsFields);
					currItem.create_time = moment(currItem.create_time).format('YYYY-MM-DD HH:mm');
					// type: 1-帖子赞 2-评论赞 3-评论的评论的赞
					if (currItem.type === 1) {
						let curContent = await productionModal.findOne({
							where: {
								id: currItem.content_id,
							},
							attributes: ['id', 'type', 'other_id'],
						});
						currItem.hasContent = true;
						if (!curContent) {
							currItem.desc = '该内容已删除';
							currItem.hasContent = false;
						} else {
							currItem.contentType = curContent.type;
							curContent = responseUtil.renderFieldsObj(curContent, ['id', 'type', 'other_id']);
							const newContent = await handleContent(curContent);
							if (newContent.type === 1) {
								currItem.title = '帖子';
								currItem.desc = newContent.postsDetail.title || '暂无描述信息';
							}
							if (newContent.type === 2) {
								currItem.title = '博客';
								currItem.desc = newContent.postsDetail.desc || '暂无描述信息';
							}
							if (newContent.type === 3) {
								currItem.title = '投票';
								currItem.desc = newContent.voteDetail.desc || '暂无描述信息';
							}
							if (newContent.type === 4) {
								currItem.title = 'PK';
								currItem.desc = newContent.battleDetail.title || '暂无描述信息';
							}
							if (newContent.type === 5) {
								currItem.title = '视频';
								currItem.desc = newContent.videoDetail.desc || '暂无描述信息';
							}
						}
					} else {
						const curComment = await commentRecordModal.findOne({
							where: {
								id: currItem.comment_id,
							},
							attributes: ['id', 'type', 'desc', 'img_urls'],
						});
						if (!curComment) {
							currItem.hasContent = false;
							currItem.desc = '该内容已删除';
						} else {
							currItem.contentType = '-1';
							currItem.title = '评论';
							currItem.desc = curComment.desc || '暂无描述信息';
						}
					}
					currItem.hadGoods = true;
					result.push(currItem);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 分页获取用户被点赞的内容详情
	getGoodsDetailByOther: async (req, res) => {
		try {
			const goodsFields = ['id', 'user_id', 'other_id', 'type', 'content_id', 'comment_id', 'create_time'];
			const { user_id, current = 1 } = req.query;
			const offset = Number((current - 1) * pagesize);
			// 赞
			const goods = await goodsRecordModal.findAll({
				where: {
					other_id: user_id,
				},
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'photo'],
					},
				],
				attributes: goodsFields,
				order: [['create_time', 'DESC']],
				limit: pagesize,
				offset,
			});
			const result = [];
			if (goods && goods.length !== 0) {
				let len = goods.length;
				while (len > 0) {
					len -= 1;
					const currItem = responseUtil.renderFieldsObj(goods[len], goodsFields);
					currItem.userDetail = responseUtil.renderFieldsObj(goods[len].userDetail || {}, [
						'id',
						'nickname',
						'photo',
						'integral',
					]);
					if (currItem.userDetail) {
						currItem.userDetail.photo = userUtil.getPhotoUrl(currItem.userDetail.photo);
					}
					currItem.create_time = moment(currItem.create_time).format('YYYY-MM-DD HH:mm');
					// type: 1-帖子赞 2-评论赞 3-评论的评论的赞
					if (currItem.type === 1) {
						let curContent = await productionModal.findOne({
							where: {
								id: currItem.content_id,
							},
							attributes: ['id', 'type', 'other_id', 'user_id'],
						});
						currItem.hasContent = true;
						if (!curContent) {
							currItem.desc = '该内容已删除';
							currItem.hasContent = false;
						} else {
							currItem.contentType = curContent.type;
							curContent = responseUtil.renderFieldsObj(curContent, ['id', 'type', 'user_id', 'other_id']);
							const newContent = await handleContent(curContent);
							if (newContent.type === 1) {
								currItem.title = '帖子';
								currItem.desc = newContent.postsDetail.title || '暂无描述信息';
							}
							if (newContent.type === 2) {
								currItem.title = '博客';
								currItem.desc = newContent.postsDetail.desc || '暂无描述信息';
							}
							if (newContent.type === 3) {
								currItem.title = '投票';
								currItem.desc = newContent.voteDetail.desc || '暂无描述信息';
							}
							if (newContent.type === 4) {
								currItem.title = 'PK';
								currItem.desc = newContent.battleDetail.title || '暂无描述信息';
							}
							if (newContent.type === 5) {
								currItem.title = '视频';
								currItem.desc = newContent.videoDetail.desc || '暂无描述信息';
							}
						}
					} else {
						const curComment = await commentRecordModal.findOne({
							where: {
								id: currItem.comment_id,
							},
							attributes: ['id', 'type', 'desc', 'img_urls'],
						});
						if (!curComment) {
							currItem.hasContent = false;
							currItem.desc = '该内容已删除';
						} else {
							currItem.contentType = '-1';
							currItem.title = '评论';
							currItem.desc = curComment.desc || '暂无描述信息';
						}
					}
					currItem.hadGoods = true;
					result.push(currItem);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除点赞
	deleteGoodsById: async (req, res) => {
		try {
			const { id } = req.body;
			await goodsRecordModal.destroy({ where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 分页获取评论详情
	getCommentsDetailByUser: async (req, res) => {
		try {
			const commentFields = ['id', 'content_id', 'comment_id', 'img_urls', 'type', 'desc', 'goods', 'create_time'];
			const { user_id, current = 1 } = req.query;
			const offset = Number((current - 1) * pagesize);
			// 评论
			const comments = await commentRecordModal.findAll({
				where: {
					user_id,
				},
				attributes: commentFields,
				order: [['create_time', 'DESC']],
				limit: pagesize,
				offset,
			});
			const result = [];
			if (comments && comments.length !== 0) {
				let len = comments.length;
				while (len > 0) {
					len -= 1;
					const currItem = responseUtil.renderFieldsObj(comments[len], commentFields);
					currItem.create_time = moment(currItem.create_time).format('YYYY-MM-DD HH:mm');
					// 默认没有点赞
					currItem.hadGoods = false;
					// 这条内容默认不存在
					currItem.hasContent = false;

					// type: 1-帖子评论 2-二级评论
					if (currItem.type === 1) {
						// 查询是否含有这条记录
						let curContent = await productionModal.findOne({
							where: {
								id: currItem.content_id,
							},
							attributes: ['id', 'type', 'other_id'],
						});
						// 查看是否点过赞
						const hadGoods = await goodsRecordModal.findOne({
							where: {
								user_id,
								type: 2,
								comment_id: currItem.id,
							},
						});
						if (hadGoods) {
							currItem.hadGoods = true;
						}
						if (!curContent) {
							currItem.contentDesc = '该内容已删除';
						} else {
							currItem.hasContent = true;
							currItem.contentType = curContent.type;
							curContent = responseUtil.renderFieldsObj(curContent, ['id', 'type', 'other_id']);
							const newContent = await handleContent(curContent);
							if (newContent.type === 1) {
								currItem.title = '帖子';
								currItem.contentDesc = newContent.postsDetail.title || '暂无描述信息';
							}
							if (newContent.type === 2) {
								currItem.title = '博客';
								currItem.contentDesc = newContent.postsDetail.desc || '暂无描述信息';
							}
							if (newContent.type === 3) {
								currItem.title = '投票';
								currItem.contentDesc = newContent.voteDetail.desc || '暂无描述信息';
							}
							if (newContent.type === 4) {
								currItem.title = 'PK';
								currItem.contentDesc = newContent.battleDetail.title || '暂无描述信息';
							}
							if (newContent.type === 5) {
								currItem.title = '视频';
								currItem.contentDesc = newContent.videoDetail.desc || '暂无描述信息';
							}
						}
					} else {
						const curComment = await commentRecordModal.findOne({
							where: {
								id: currItem.comment_id,
							},
							attributes: ['id', 'type', 'desc', 'img_urls'],
						});
						// 查看是否点过赞
						const hadGoods = await goodsRecordModal.findOne({
							where: {
								user_id,
								type: 3,
								comment_id: currItem.id,
							},
						});
						if (hadGoods) {
							currItem.hadGoods = true;
						}
						currItem.hasContent = true;
						if (!curComment) {
							currItem.contentDesc = '该内容已删除';
						} else {
							currItem.hasContent = true;
							currItem.contentType = '-1';
							currItem.title = '评论';
							currItem.contentDesc = curComment.desc || '暂无描述信息';
						}
					}
					let imgUrls = [];
					if (currItem.img_urls) {
						imgUrls = JSON.parse(currItem.img_urls) || [];
						// eslint-disable-next-line
						imgUrls.forEach((temp) => (temp.url = config.preUrl.commentUrl + temp.url));
					}
					currItem.img_urls = imgUrls;
					result.push(currItem);
				}
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除评论
	deleteCommentById: async (req, res) => {
		try {
			const { id, user_id } = req.body;
			// 删除评论
			await commentRecordModal.destroy({ where: { id } });
			// 删除点赞
			await goodsRecordModal.destroy({ where: { user_id, comment_id: id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
