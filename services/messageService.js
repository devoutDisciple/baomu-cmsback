const Sequelize = require('sequelize');
const moment = require('moment');
const sizeOf = require('image-size');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const message = require('../models/message');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');
const config = require('../config/config');

const Op = Sequelize.Op;
const messageModal = message(sequelize);
const userModal = user(sequelize);

messageModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

module.exports = {
	// 添加信息
	addMsg: async (req, res) => {
		try {
			const { user_id, person_id, username, user_photo, content, type } = req.body;
			await messageModal.create({
				user_id,
				person_id,
				username,
				user_photo,
				content,
				type,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取我收到的信息
	msgsByUserId: async (req, res) => {
		try {
			const { user_id, msg_accept_time } = req.query;
			// 查询所有未读信息
			const msgs = await messageModal.findAll({
				where: {
					[Op.or]: {
						person_id: user_id,
						[Op.and]: {
							type: 2,
							create_time: {
								[Op.gte]: msg_accept_time,
							},
						},
					},
					is_delete: 1,
				},
				order: [['create_time', 'DESC']],
			});
			if (!msgs) return res.send(resultMessage.success([]));
			// 将所有未读信息设置为已读
			messageModal.update(
				{ is_delete: 2 },
				{
					where: {
						person_id: user_id,
					},
				},
			);
			const result = responseUtil.renderFieldsAll(msgs, [
				'id',
				'user_id',
				'person_id',
				'username',
				'user_photo',
				'content',
				'type',
				'create_time',
			]);

			if (result && result.length !== 0) {
				result.forEach((item) => {
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				});
				return res.send(resultMessage.success({ data: result }));
			}
			res.send(resultMessage.success('暂无消息'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传图片
	uploadImg: async (req, res, filename) => {
		try {
			const { width, height } = sizeOf(req.file.path);
			const imgUrl = config.preUrl.msgUrl + filename;
			res.send(resultMessage.success({ url: imgUrl, width, height }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
