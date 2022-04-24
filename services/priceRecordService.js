const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const demand = require('../models/demand');
const user = require('../models/user');
const priceRecord = require('../models/price_record');
const responseUtil = require('../util/responseUtil');
const { getPhotoUrl } = require('../util/userUtil');

const priceRecordModal = priceRecord(sequelize);
const userModal = user(sequelize);
const demandModal = demand(sequelize);

demandModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });

module.exports = {
	// 根据需求id获取报价记录
	getPriceRecordByDemandId: async (req, res) => {
		try {
			const { demand_id } = req.query;
			if (!demand_id) return res.send(resultMessage.success('系统错误'));
			const statement = `select distinct user_id from price_record where demand_id = ${demand_id}`;
			const usersList = await sequelize.query(statement, { type: sequelize.QueryTypes.SELECT });
			const result = [];
			if (usersList && usersList.length !== 0) {
				const user_ids = usersList.map((item) => item.user_id);
				let len = user_ids.length;
				while (len > 0) {
					len -= 1;
					const curUserId = user_ids[len];
					const price_record_list = await priceRecordModal.findAll({
						where: { user_id: curUserId, demand_id },
						order: [['create_time', 'ASC']],
					});
					const priceList = responseUtil.renderFieldsAll(price_record_list, [
						'id',
						'publisher_id',
						'demand_id',
						'price',
						'type',
						'state',
						'create_time',
					]);
					priceList.forEach((item) => {
						item.create_time = moment(item.create_time).format('YYYY.MM.DD HH:mm');
					});
					let userDetail = await userModal.findOne({
						where: { id: curUserId },
						attributes: ['id', 'nickname', 'photo', 'type'],
					});
					userDetail = responseUtil.renderFieldsObj(userDetail, ['id', 'nickname', 'photo']);
					userDetail.photo = getPhotoUrl(userDetail.photo, userDetail.type);
					result.unshift({
						userDetail,
						records: priceList,
					});
				}
			}
			console.log(result, 222);
			// 更新需求的竞价人员
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
