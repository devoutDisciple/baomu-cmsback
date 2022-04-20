const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const type = require('../models/type');
const responseUtil = require('../util/responseUtil');

const typeModal = type(sequelize);

module.exports = {
	// 获取所有类别
	getAllType: async (req, res) => {
		try {
			const data = await typeModal.findAll({ where: { is_delete: 1 }, order: [['sort', 'DESC']] });
			const result = responseUtil.renderFieldsAll(data, ['id', 'name']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
