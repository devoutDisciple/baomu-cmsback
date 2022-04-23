const accountController = require('./accountController');
const dataController = require('./dataController');
const userController = require('./userController');
const idcardConroller = require('./idcardConroller');
const levelController = require('./levelController');
const schoolController = require('./schoolController');
const productionController = require('./productionController');
const deviceController = require('./deviceController');
const skillController = require('./skillController');
const teamController = require('./teamController');
const demandController = require('./demandController');
const priceRecordController = require('./priceRecordController');
const payController = require('./payController');

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
	// 作品相关
	app.use('/production', productionController);
	// 广场相关
	app.use('/square', deviceController);
	// 技能相关
	app.use('/skill', skillController);
	// 团队相关
	app.use('/team', teamController);
	// 需求相关
	app.use('/demand', demandController);
	// 报价相关
	app.use('/priceRecord', priceRecordController);
	// 支付相关
	app.use('/pay', payController);
};
module.exports = router;
