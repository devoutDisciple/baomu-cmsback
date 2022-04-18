const schedule = require('node-schedule');
const Sequelize = require('sequelize');
const moment = require('moment');
// const config = require('../config/config');
const sequelize = require('../dataSource/MysqlPoolClass');
const user = require('../models/user');
const data = require('../models/data');
const content = require('../models/content');
const goodsRecord = require('../models/goods_record');
const commentRecord = require('../models/comment_record');

const Op = Sequelize.Op;
const userModel = user(sequelize);
const dataModel = data(sequelize);
const contentModel = content(sequelize);
const goodsRecordModel = goodsRecord(sequelize);
const commentRecordModel = commentRecord(sequelize);

const rule = new schedule.RecurrenceRule();

// if (config.env === 'dev') {
// 	rule.minute = 1;
// } else {
// 	rule.minute = [0, 10, 20, 30, 40, 50];
// }
rule.minute = [0, 10, 20, 30, 40, 50];
schedule.scheduleJob(rule, async () => {
	console.log('执行时间: ', moment().format('YYYY-MM-DD HH:mm:ss'));
	const todayTime = moment(new Date()).format('YYYY-MM-DD 00:00:01');
	// 会员总数
	const user_total = await userModel.count({ where: { is_delete: 1 } });
	// 今日新增会员
	const user_today = await userModel.count({ where: { create_time: { [Op.gte]: todayTime } } });
	// 发布总数
	const publish_total = await contentModel.count({ where: { is_delete: 1 } });
	// 今日新增发布
	const publish_today = await contentModel.count({ where: { create_time: { [Op.gte]: todayTime } } });
	// 点赞总数
	const goods_total = await goodsRecordModel.count();
	// 今日新增点赞
	const goods_today = await goodsRecordModel.count({ where: { create_time: { [Op.gte]: todayTime } } });
	// 评论总数
	const comment_total = await commentRecordModel.count({ where: { is_delete: 1 } });
	// 今日新增评论
	const comment_today = await commentRecordModel.count({ where: { create_time: { [Op.gte]: todayTime } } });
	dataModel.create({
		user_total,
		user_today,
		publish_total,
		publish_today,
		goods_total,
		goods_today,
		comment_total,
		comment_today,
		create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
	});
});
