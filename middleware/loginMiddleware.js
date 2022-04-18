const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const accounts = require('../models/account');

const accountsModel = accounts(sequelize);

function loginMiddleware(req, res, next) {
	const cookies = req.signedCookies;
	// 判断用户cookie是否正确
	if (cookies && cookies.userinfo) {
		const userinfo = cookies.userinfo;
		const account = userinfo.split('_#$%^%$#_')[0];
		const password = userinfo.split('_#$%^%$#_')[1];
		return accountsModel
			.findOne({
				where: {
					account,
				},
			})
			.then((user) => {
				if (account === user.account && password === user.password && req.path === '/account/isLogin') {
					return res.send(
						resultMessage.success({
							username: user.username,
							account: user.account,
							role: user.role,
							phone: user.phone,
						}),
					);
				}
				if (account === user.account && password === user.password) return next();
				return res.send(resultMessage.loginError('请登录!'));
			});
	}
	if (!cookies.userinfo && req.url !== '/account/login') {
		return res.send(resultMessage.loginError('请登录!'));
	}
	next();
}

module.exports = loginMiddleware;
