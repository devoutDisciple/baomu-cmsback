const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const instrument = require('../models/instrument');
const responseUtil = require('../util/responseUtil');

const instrumentModal = instrument(sequelize);

module.exports = {
	// 获取所有乐器
	getAllBySelect: async (req, res) => {
		try {
			const instrumentFields = ['id', 'name', 'url'];
			const instruments = await instrumentModal.findAll({
				attributes: ['id', 'name', 'url'],
				order: [
					['sort', 'DESC'],
					['create_time', 'ASC'],
				],
			});
			const result = responseUtil.renderFieldsAll(instruments, instrumentFields);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},
};
