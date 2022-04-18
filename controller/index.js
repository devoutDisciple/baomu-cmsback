const accountController = require('./accountController');
const dataController = require('./dataController');
const userController = require('./userController');
const swiperController = require('./swiperController');
const projectController = require('./projectController');
const subjectController = require('./subjectController');
const teacherController = require('./teacherController');
const orderController = require('./orderController');
// const feedbackController = require('./feedbackController');
// const replyController = require('./replyController');
// const goodsController = require('./goodsController');

const router = (app) => {
	// 登录相关
	app.use('/account', accountController);
	// 数据汇总
	app.use('/data', dataController);
	// 用户相关
	app.use('/user', userController);
	// 板块相关
	app.use('/swiper', swiperController);
	// 课程类别管理
	app.use('/project', projectController);
	// 课程相关
	app.use('/subject', subjectController);
	// 老师相关
	app.use('/teacher', teacherController);
	// 话题相关
	app.use('/order', orderController);
};
module.exports = router;
