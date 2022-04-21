const accountController = require('./accountController');
const dataController = require('./dataController');
const userController = require('./userController');
const idcardConroller = require('./idcardConroller');
const levelController = require('./levelController');
const schoolController = require('./schoolController');
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
	// 等级认证相关
	app.use('/level', levelController);
	// 毕业院校认证相关
	app.use('/school', schoolController);
	// // 课程相关
	// app.use('/subject', subjectController);
	// // 老师相关
	// app.use('/teacher', teacherController);
	// // 话题相关
	// app.use('/order', orderController);
};
module.exports = router;
