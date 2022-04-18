const resultMessage = require('../util/resultMessage');

const sequelize = require('../dataSource/MysqlPoolClass');
const accounts = require('../models/account');

const accountModel = accounts(sequelize);

module.exports = {
	// 查看用户是否登录
	isLogin: async (req, res) => {
		try {
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 用户登录
	login: async (req, res) => {
		try {
			const { account, password } = req.body;
			const user = await accountModel.findOne({
				where: {
					account,
				},
			});
			if (!user || password !== user.password) return res.send(resultMessage.error('用户名或密码错误!'));
			const value = `${account}_#$%^%$#_${password}`;
			res.cookie('userinfo', value, {
				expires: new Date(Date.now() + 10000 * 60 * 60 * 2),
				signed: true,
				httpOnly: true,
			}); // signed 表示对cookie加密
			res.send(
				resultMessage.success({
					id: user.id,
					account: user.account,
					username: user.username,
					role: user.role,
				}),
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
