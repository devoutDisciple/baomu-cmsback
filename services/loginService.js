const request = require('request');
const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const user = require('../models/user');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');

const userModal = user(sequelize);
const config = require('../config/config');

module.exports = {
	// 通过openid微信登录
	loginByWxOpenid: async (req, res) => {
		try {
			const { code, avatarUrl, nickName } = req.body;
			request.get(
				`https://api.weixin.qq.com/sns/jscode2session?appid=${config.wx_appid}&secret=${config.wx_appSecret}&js_code=${code}&grant_type=${config.wx_grantType}`,
				async (error, response, body) => {
					if (error) res.send(resultMessage.error('登录失败'));
					const { openid } = JSON.parse(body);
					let userDetail = await userModal.findOne({ where: { wx_openid: openid } });
					// 初始登录，仅仅获得了openid
					if (!userDetail && !avatarUrl && !nickName) {
						await userModal.create({
							wx_openid: openid,
						});
					}
					// 直接登录，获得了用户基本信息
					if (!userDetail && avatarUrl && nickName) {
						await userModal.create({
							wx_openid: openid,
							username: nickName,
							photo: avatarUrl,
							create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
						});
						userDetail = {
							wx_openid: openid,
							username: nickName,
							photo: avatarUrl,
						};
					}
					// 有了用户openid，却没用用户基本信息
					if (userDetail && avatarUrl && nickName) {
						await userModal.update(
							{
								username: nickName,
								photo: avatarUrl,
							},
							{
								where: {
									wx_openid: openid,
								},
							},
						);
						userDetail = {
							wx_openid: openid,
							username: nickName,
							photo: avatarUrl,
						};
					}
					let userResult = await userModal.findOne({ where: { wx_openid: openid } });
					userResult = responseUtil.renderFieldsObj(userResult, ['id', 'wx_openid', 'username', 'photo']);
					res.send(resultMessage.success(userResult));
				},
			);
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
