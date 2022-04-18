const Sequelize = require('sequelize');
const moment = require('moment');
const config = require('../config/config');
const sequelize = require('../dataSource/MysqlPoolClass');
const swiper = require('../models/swiper');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');

const Op = Sequelize.Op;
const swiperModal = swiper(sequelize);
const pagesize = 10;
const commonFields = ['id', 'url', 'sort'];

module.exports = {
	// 分页获取板块数据
	getAllSwiper: async (req, res) => {
		try {
			const { current = 1, name } = req.query;
			const condition = { is_delete: 1 };
			if (name) {
				condition.name = {
					[Op.like]: `%${name}%`,
				};
			}
			const offset = Number((current - 1) * pagesize);
			const swipers = await swiperModal.findAndCountAll({
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
					item.url = config.preUrl.swiperUrl + item.url;
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 新增轮播图
	addswiper: async (req, res) => {
		try {
			const { sort, filename } = req.body;
			await swiperModal.create({
				url: filename,
				sort,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除轮播图
	deleteById: async (req, res) => {
		try {
			const { swiper_id } = req.body;
			if (!swiper_id) return res.send(resultMessage.error('系统错误'));
			await swiperModal.update(
				{ is_delete: 2 },
				{
					where: {
						id: swiper_id,
					},
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 编辑轮播图
	editSwiper: async (req, res) => {
		try {
			const { id, sort, filename } = req.body;
			const data = {
				sort,
				update_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			};
			if (filename) {
				data.url = filename;
			}
			await swiperModal.update(data, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 上传图标
	uploadImg: async (req, res, filename) => {
		try {
			res.send(resultMessage.success(filename));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
