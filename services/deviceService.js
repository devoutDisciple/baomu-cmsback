const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const device = require('../models/device');
const user = require('../models/user');
const responseUtil = require('../util/responseUtil');
const { getPhotoUrl } = require('../util/userUtil');
const config = require('../config/config');

const userModal = user(sequelize);
const deviceModal = device(sequelize);

deviceModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

const Op = Sequelize.Op;
const pagesize = 10;

module.exports = {
	// 获取摄影棚
	getAllDevicesByPage: async (req, res) => {
		try {
			const { current = 1, nickname, desc } = req.query;
			const commonFields = [
				'id',
				'name',
				'addressName',
				'start_time',
				'end_time',
				'img_urls',
				'price',
				'desc',
				'is_authentication',
				'grade',
				'comment_num',
				'goods_num',
				'province',
				'city',
				'addressName',
				'addressAll',
				'create_time',
			];
			const deviceWhere = { is_delete: 1 };
			const userWhere = {};
			if (String(desc).trim()) {
				deviceWhere.desc = {
					[Op.like]: `%${String(desc).trim()}%`,
				};
			}
			if (String(nickname).trim()) {
				userWhere.nickname = {
					[Op.like]: `%${String(nickname).trim()}%`,
				};
			}
			const offset = Number((current - 1) * pagesize);
			const devices = await deviceModal.findAndCountAll({
				where: deviceWhere,
				order: [['create_time', 'DESC']],
				attributes: commonFields,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'username', 'photo', 'type'],
						where: userWhere,
					},
				],
				limit: pagesize,
				offset,
			});
			const result = {
				count: 0,
				list: [],
			};
			if (!devices || !devices.rows || devices.rows.length === 0) {
				return res.send(resultMessage.success(result));
			}
			result.count = devices.count;
			result.list = responseUtil.renderFieldsAll(devices.rows, [...commonFields, 'userDetail']);
			if (result.list.length !== 0) {
				result.list.forEach((item) => {
					if (item.userDetail) {
						item.userPhoto = getPhotoUrl(item.userDetail.photo, item.userDetail.type);
						item.nickname = item.userDetail.nickname;
						item.username = item.userDetail.username;
						delete item.userDetail;
					}
					const img_urls = JSON.parse(item.img_urls);
					if (Array.isArray(img_urls)) {
						const new_img_urls = [];
						img_urls.forEach((url) => {
							new_img_urls.push(config.preUrl.devicenUrl + url);
						});
						item.img_url = new_img_urls;
					}
					item.start_time = moment(item.start_time).format('YYYY.MM.DD');
					item.end_time = moment(item.end_time).format('YYYY.MM.DD');
					item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
				});
			}
			res.send(resultMessage.success(result || []));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除
	deleteDeviceById: async (req, res) => {
		try {
			const { id } = req.query;
			await deviceModal.update({ is_delete: 2 }, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
