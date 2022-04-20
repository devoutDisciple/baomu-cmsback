const accountController = require('./accountController');
const dataController = require('./dataController');
const userController = require('./userController');
const idcardConroller = require('./idcardConroller');
// const swiperController = require('./swiperController');
// const projectController = require('./projectController');
// const subjectController = require('./subjectController');
// const teacherController = require('./teacherController');
// const orderController = require('./orderController');

const router = (app) => {
	// 登录相关
	app.use('/account', accountController);
	// 数据汇总
	app.use('/data', dataController);
	// 用户相关
	app.use('/user', userController);
	// 实名认证相关
	app.use('/idcard', idcardConroller);
	// // 课程类别管理
	// app.use('/project', projectController);
	// // 课程相关
	// app.use('/subject', subjectController);
	// // 老师相关
	// app.use('/teacher', teacherController);
	// // 话题相关
	// app.use('/order', orderController);
};
module.exports = router;
