const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const device = require('../models/device');
const user = require('../models/user');
const mapUtil = require('../util/mapUtil');
const responseUtil = require('../util/responseUtil');
const { getPhotoUrl } = require('../util/userUtil');
const config = require('../config/config');

const timeformat = 'YYYY-MM-DD HH:mm:ss';

const userModal = user(sequelize);
const deviceModal = device(sequelize);

deviceModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

const pagesize = 10;

module.exports = {
	// 上传图片
	uploadFile: async (req, res, filename) => {
		try {
			res.send(resultMessage.success({ url: filename }));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 发布摄影棚情况
	add: async (req, res) => {
		try {
			const {
				user_id,
				name,
				start_time,
				end_time,
				img_urls,
				addressAll,
				addressName,
				latitude,
				longitude,
				desc,
				price,
				is_authentication,
			} = req.body;
			if (
				!user_id ||
				!name ||
				!start_time ||
				!end_time ||
				!img_urls ||
				!addressAll ||
				!addressName ||
				!latitude ||
				!longitude ||
				!desc ||
				!price ||
				!is_authentication
			) {
				return res.send(resultMessage.error('系统错误'));
			}
			const { province, city } = await mapUtil.getAddressByCode({ latitude, longitude });
			const params = {
				user_id,
				name,
				start_time,
				end_time,
				img_urls,
				price,
				desc,
				is_authentication,
				latitude,
				longitude,
				province,
				city,
				addressAll,
				addressName,
				create_time: moment().format(timeformat),
			};
			// 创建摄影棚记录
			await deviceModal.create(params);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取摄影棚
	getAllDevicesByPage: async (req, res) => {
		try {
			const { current } = req.query;
			const commonFields = [
				'id',
				'name',
				'addressName',
				'price',
				'grade',
				'img_urls',
				'comment_num',
				'desc',
				'start_time',
				'end_time',
			];
			const offset = Number((current - 1) * pagesize);
			const devices = await deviceModal.findAll({
				where: { is_delete: 1 },
				order: [['create_time', 'DESC']],
				attributes: commonFields,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'photo'],
					},
				],
				limit: pagesize,
				offset,
			});
			if (!device) res.send(resultMessage.success([]));
			const result = responseUtil.renderFieldsAll(devices, [...commonFields, 'userDetail']);
			result.forEach((item) => {
				const img_urls = JSON.parse(item.img_urls);
				item.show_img = config.preUrl.devicenUrl + img_urls[0];
				item.userDetail.photo = getPhotoUrl(item.userDetail.photo);
				item.start_time = moment(item.start_time).format('YYYY.MM.DD');
				item.end_time = moment(item.end_time).format('YYYY.MM.DD');
				delete item.img_urls;
			});
			res.send(resultMessage.success(result || []));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取摄影棚详情
	getDeviceDetailById: async (req, res) => {
		try {
			const { id } = req.query;
			const commenFields = [
				'id',
				'user_id',
				'name',
				'start_time',
				'end_time',
				'img_urls',
				'price',
				'desc',
				'is_authentication',
				'grade',
				'comment_num',
				'addressName',
				'create_time',
			];
			const detail = await deviceModal.findOne({
				where: { id },
				attributes: commenFields,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'photo'],
					},
				],
			});
			if (!detail) return res.send(resultMessage.error({}));
			const result = responseUtil.renderFieldsObj(detail, [...commenFields, 'userDetail']);
			const img_urls = JSON.parse(result.img_urls);
			const newImgs = [];
			result.show_img = config.preUrl.devicenUrl + img_urls[0];
			result.start_time = moment(result.start_time).format('MM.DD');
			result.end_time = moment(result.end_time).format('MM.DD');
			result.userDetail.photo = getPhotoUrl(result.userDetail.photo);
			img_urls.forEach((item) => {
				newImgs.push({
					type: 'img',
					url: config.preUrl.devicenUrl + item,
				});
			});
			result.newImgs = newImgs;
			delete result.img_urls;
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
