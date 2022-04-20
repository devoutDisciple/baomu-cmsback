const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const team = require('../models/team');
const user = require('../models/user');
const message = require('../models/message');
const production = require('../models/production');
const teamUser = require('../models/team_user');
const ObjectUtil = require('../util/ObjectUtil');
const mapUtil = require('../util/mapUtil');
const config = require('../config/config');
const responseUtil = require('../util/responseUtil');
const { getPhotoUrl } = require('../util/userUtil');

const timeformat = 'YYYY-MM-DD HH:mm:ss';

const messageModal = message(sequelize);
const teamUserModal = teamUser(sequelize);
const productionModal = production(sequelize);
const userModal = user(sequelize);
const teamModal = team(sequelize);

teamUserModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

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

	// 创建团队
	add: async (req, res) => {
		try {
			const { user_id, name, photo, bg_url, team_user_ids, study_id, desc, latitude, longitude } = req.body;
			if (!user_id || !name || !photo || !bg_url || !team_user_ids || !study_id || !desc || !latitude || !longitude) {
				return res.send(resultMessage.error('系统错误'));
			}
			const team_users = team_user_ids.split(',');
			const { province, city, formatted_address } = await mapUtil.getAddressByCode({ latitude, longitude });
			const params = {
				team_uuid: ObjectUtil.getUuid(),
				user_ids: team_user_ids,
				ower_id: user_id,
				name,
				photo,
				bg_url,
				style_id: study_id,
				desc,
				latitude,
				longitude,
				province,
				city,
				address: formatted_address,
				create_time: moment().format(timeformat),
			};
			// 创建团队
			const teamDetail = await teamModal.create(params);
			// 在用户表创建用户
			const userDetail = await userModal.create({
				wx_openid: teamDetail.team_uuid,
				nickname: teamDetail.name,
				photo: teamDetail.photo,
				bg_url: teamDetail.bg_url,
				type: 2, // 1-个人  2-团队
				team_id: teamDetail.id,
				style_id: teamDetail.style_id,
				desc: teamDetail.desc,
				latitude,
				longitude,
				province,
				city,
				address: formatted_address,
				create_time: teamDetail.create_time,
			});
			// 更新团队表
			await teamModal.update({ user_table_id: userDetail.id }, { where: { id: teamDetail.id } });
			if (Array.isArray(team_users)) {
				const teamParams = [];
				const msgParams = [];
				team_users.forEach((item) => {
					const flag = Number(item) === Number(user_id);
					const time = moment().format('YYYY-MM-DD HH:mm:ss');
					// 邀请信息
					const msg = {
						user_id,
						person_id: item,
						content: JSON.stringify({ team_id: teamDetail.id }),
						type: 4,
						create_time: time,
					};
					const obj = {
						user_id: item,
						team_id: teamDetail.id,
						user_table_id: userDetail.id,
						// 乐队的担当 位置
						type: -1,
						// 1-未参与(邀请阶段) 2-参与 3-已经拒绝,如果是队长，默认参加
						state: flag ? 2 : 1,
						// 是否是拥有者 1-是 2-不是
						is_owner: flag ? 1 : 2,
						create_time: time,
					};
					if (flag) {
						obj.join_time = time;
					}
					teamParams.push(obj);
					msgParams.push(msg);
				});
				// 批量创建队员
				await teamUserModal.bulkCreate(teamParams);
				// 给队员发送邀请信息
				await messageModal.bulkCreate(msgParams);
			}
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 获取团队列表根据用户id
	getTeamsByUserId: async (req, res) => {
		try {
			const { user_id } = req.query;
			if (!user_id) return res.send(resultMessage.error('系统错误'));
			const condition = [sequelize.fn('FIND_IN_SET', user_id, sequelize.col('user_ids')), { is_delete: 1 }];
			const teams = await teamModal.findAll({
				where: condition,
				order: [['create_time', 'DESC']],
			});
			if (!teams || teams.length === 0) return res.send(resultMessage.success([]));
			const result = responseUtil.renderFieldsAll(teams, [
				'id',
				'user_ids',
				'ower_id',
				'user_table_id',
				'name',
				'photo',
				'create_time',
			]);
			let len = result.length;
			const newResult = [];
			while (len > 0) {
				len -= 1;
				const currentItem = result[len];
				currentItem.photo = config.preUrl.teamUrl + currentItem.photo;
				currentItem.create_time = moment(currentItem.create_time).format('YYYY.MM.DD');
				currentItem.user_ids = currentItem.user_ids.split(',');
				currentItem.person_num = currentItem.user_ids.length;
				const productionList = await productionModal.findAll({
					attributes: ['id', 'img_url', 'video'],
					// type 1-作品 2-动态
					where: { user_id: currentItem.user_table_id, type: 2 },
					order: [['create_time', 'DESC']],
					limit: 3,
					offset: 0,
				});
				let productionImgs = [];
				if (productionList && productionList.length !== 0) {
					productionList.forEach((item) => {
						const img_url = JSON.parse(item.img_url);
						const videoDetail = JSON.parse(item.video);
						if (img_url && img_url.length !== 0) {
							const newImgs = img_url.map((img) => ({ type: 'img', url: `${config.preUrl.productionUrl}${img}` }));
							productionImgs = [...newImgs, ...productionImgs];
						}
						if (videoDetail && Object.keys(videoDetail).length !== 0) {
							videoDetail.url = config.preUrl.productionUrl + videoDetail.url;
							videoDetail.photo.url = config.preUrl.productionUrl + videoDetail.photo.url;
							productionImgs.push({ ...videoDetail, type: 'video' });
						}
					});
				}
				currentItem.productionImgs = productionImgs;
				newResult.unshift(currentItem);
			}

			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 根据teamid获取成员列表
	getTeamsUsersByTeamId: async (req, res) => {
		try {
			// type: 1-查询已同意的队员 2-查看已被邀请的成员
			const { team_id, type } = req.query;
			if (!team_id) return res.send(resultMessage.error('系统错误'));
			const commonFields = ['id', 'user_id', 'type', 'state', 'is_owner', 'join_time', 'create_time'];
			const where = { team_id, is_delete: 1 };
			if (Number(type) === 1) {
				where.state = 2;
			}
			const teamUserList = await teamUserModal.findAll({
				where,
				attributes: commonFields,
				order: [
					['join_time', 'DESC'],
					['create_time', 'DESC'],
				],
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'photo'],
					},
				],
			});
			if (!teamUserList || teamUserList.length === 0) return res.send(resultMessage.success([]));
			const newTeamUserList = responseUtil.renderFieldsAll(teamUserList, [...commonFields, 'userDetail']);
			newTeamUserList.forEach((item) => {
				item.userDetail.photo = getPhotoUrl(item.userDetail.photo);
			});
			res.send(resultMessage.success(newTeamUserList));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 删除参与队员
	deleteTeamUser: async (req, res) => {
		try {
			const { team_user_id, user_id, team_id } = req.body;
			if (!team_user_id || !user_id || !team_id) return res.send(resultMessage.error('系统错误'));
			const teamDetail = await teamModal.findOne({ where: { id: team_id } });
			const user_arr = teamDetail.user_ids.split(',');
			const new_user_ids = user_arr.filter((item) => Number(item) !== Number(user_id)).join(',');
			// 从team表中删除该成员
			await teamModal.update({ user_ids: new_user_ids }, { where: { id: team_id } });
			// 更新队员表
			await teamUserModal.update({ is_delete: 2 }, { where: { id: team_user_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 根据团队用户id获取信息
	getUserDetailByTeamUserId: async (req, res) => {
		try {
			const { team_user_id } = req.query;
			if (!team_user_id) return res.send(resultMessage.error('系统错误'));
			const commonFields = ['id', 'user_id', 'type'];
			const teamUserDetail = await teamUserModal.findOne({
				where: { id: team_user_id },
				attributes: commonFields,
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'nickname', 'photo'],
					},
				],
			});
			if (!teamUserDetail) return res.send(resultMessage.success([]));
			const result = responseUtil.renderFieldsObj(teamUserDetail, [...commonFields, 'userDetail']);
			result.userDetail.photo = getPhotoUrl(result.userDetail.photo);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 根据team_user_id修改乐队担当
	updateUserDetailByTeamUserId: async (req, res) => {
		try {
			const { team_user_id, type } = req.body;
			if (!team_user_id) return res.send(resultMessage.error('系统错误'));

			await teamUserModal.update({ type }, { where: { id: team_user_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 根据乐队id查询详情
	getDetailByTeamId: async (req, res) => {
		try {
			const { team_id } = req.query;
			if (!team_id) return res.send(resultMessage.error('系统错误'));
			const result = await teamModal.findOne({ where: { id: team_id } });
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 添加乐队新成员
	addNewTeamUser: async (req, res) => {
		try {
			const { userIds, team_id } = req.body;
			if (!userIds || userIds.length === 0) return res.send(resultMessage.success('success'));
			if (!team_id) return res.send(resultMessage.error('系统错误'));
			const teamDetail = await teamModal.findOne({ where: { id: team_id } });
			if (!teamDetail) return res.send(resultMessage.error('系统错误'));
			const user_ids = teamDetail.user_ids;
			const user_ids_arr = user_ids.split(',');
			// 去重
			const newUser_ids = Array.from(new Set([...user_ids_arr, ...userIds])).join(',');
			// 更新团队队员列表
			await teamModal.update({ user_ids: newUser_ids }, { where: { id: team_id } });
			const teamParams = [];
			const msgParams = [];

			if (Array.isArray(userIds)) {
				userIds.forEach((item) => {
					const time = moment().format('YYYY-MM-DD HH:mm:ss');
					// 创建将要发送的邀请信息
					msgParams.push({
						person_id: item,
						content: JSON.stringify({ team_id: teamDetail.id }),
						create_time: time,
						type: 4,
					});
					// 创建团队成员
					teamParams.push({
						user_id: item,
						team_id,
						user_table_id: teamDetail.user_table_id,
						// 乐队的担当 位置
						type: -1,
						// 1-未参与(邀请阶段) 2-参与 3-已经拒绝,如果是队长，默认参加
						state: 1,
						// 是否是拥有者 1-是 2-不是
						is_owner: 2,
						create_time: time,
					});
				});
			}
			// 批量创建队员
			await teamUserModal.bulkCreate(teamParams);
			// 给队员发送邀请信息
			await messageModal.bulkCreate(msgParams);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 编辑乐队信息
	updateTeamDetail: async (req, res) => {
		try {
			const { user_id, team_id, params } = req.body;
			if (!user_id || !team_id) return res.send(resultMessage.error('系统错误'));
			await teamModal.update(params, { where: { id: team_id } });
			await userModal.update(params, { where: { id: user_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 解散乐队
	cancelTeam: async (req, res) => {
		try {
			const { user_id, team_id } = req.body;
			if (!user_id || !team_id) return res.send(resultMessage.error('系统错误'));
			// 删除user表中team
			await userModal.update({ is_delete: 2 }, { where: { id: user_id } });
			// 删除team表的数据
			await teamModal.update({ is_delete: 2 }, { where: { id: team_id } });
			// 跟心team_user的表的数据
			await teamUserModal.update({ is_delete: 2 }, { where: { team_id } });
			// 删除作品
			await productionModal.update({ is_delete: 2 }, { where: { user_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 乐队成员接受或者拒绝邀请
	decisionInvitation: async (req, res) => {
		try {
			const { user_id, team_id, state } = req.body;
			if (!user_id || !team_id || !state) return res.send(resultMessage.error('系统错误'));
			// 更新team_user的表的数据
			await teamUserModal.update({ state }, { where: { user_id, team_id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	// 根据团队id和个人id获取个人在乐队信息
	teamUserDetail: async (req, res) => {
		try {
			const { user_id, team_id } = req.query;
			if (!user_id || !team_id) return res.send(resultMessage.error('系统错误'));
			const result = await teamUserModal.findOne({ where: { team_id, user_id } });
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
