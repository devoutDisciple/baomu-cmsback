const Sequelize = require('sequelize');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const content = require('../models/content');
const user = require('../models/user');

const Op = Sequelize.Op;
const contentModal = content(sequelize);
const userModal = user(sequelize);
contentModal.belongsTo(userModal, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
const pagesize = 10;

const contentCommonFields = [
	'id',
	'user_id',
	'circle_ids',
	'circle_names',
	'topic_ids',
	'topic_names',
	'other_id',
	'type',
	'goods',
	'comment',
	'share',
	'create_time',
];

module.exports = {
	// 获取个人圈子
	test: async (req, res) => {
		try {
			const { current = 1 } = req.query;
			// const result = await contentModal.findAll({
			// 	// where: [sequelize.fn('CONCAT', ',', sequelize.col('circle_ids'), ','), { is_delete: 1 }],
			// 	where: [[sequelize.fn('CONCAT', ',', sequelize.col('circle_ids'), ','), 'REGEXP', ',(5|7|16),'], { is_delete: 1 }],
			// 	attributes: ['id'],
			// });
			// res.send(resultMessage.success(result));
			const offset = Number((current - 1) * pagesize);
			const result2 = await contentModal.findAll({
				where: {
					[Op.or]: {
						user_id: [1, 2, 3, 4],
						circle_ids: sequelize.fn('CONCAT', ',', sequelize.col('circle_ids'), ','),
					},
					is_delete: 1,
				},
				include: [
					{
						model: userModal,
						as: 'userDetail',
						attributes: ['id', 'username', 'photo', 'school'],
					},
				],
				order: [['create_time', 'DESC']],
				attributes: contentCommonFields,
				limit: pagesize,
				offset,
			});
			res.send(resultMessage.success(result2));

			// sequelize
			// 	.query(
			// 		'SELECT id, user_id, circle_ids, circle_names, topic_ids, topic_names, other_id, type, goods, comment, share, create_time, "userDetail"."id" AS "userDetail.id", "userDetail"."username" AS "userDetail.username", "userDetail"."photo" AS "userDetail.photo", "userDetail"."school" AS "userDetail.school" FROM "content" AS "content" LEFT OUTER JOIN "user" AS "userDetail" ON "content"."user_id" = "userDetail"."id" WHERE "content"."circle_ids" = CONCAT(',
			// 		', "circle_ids", ',
			// 		') AND "content"."is_delete" = 1 ORDER BY "content"."create_time" DESC LIMIT 0, 10',
			// 		{ type: sequelize.QueryTypes.SELECT },
			// 	)
			// 	.then(function (users) {
			// 		console.log(users);
			// 	});
		} catch (error) {
			console.log(error);
			res.send(resultMessage.error());
		}
	},

	test2: async (req, res) => {
		const str1 =
			'SELECT content.id, content.user_id, content.circle_ids, content.circle_names, content.topic_ids, content.topic_names, content.other_id, content.type, content.goods, content.comment, content.share, content.create_time, ';
		const str2 =
			"`userDetail`.`id` AS `userDetail.id`, userDetail.username AS 'userDetail.username', userDetail.photo AS 'userDetail.photo',userDetail.school AS 'userDetail.school' ";
		const str3 = 'FROM content  LEFT OUTER JOIN user AS userDetail ON content.user_id = userDetail.id ';
		const str4 =
			"WHERE  CONCAT(',', circle_ids, ',') REGEXP ',(5|7|16),' AND content.is_delete = 1 ORDER BY content.create_time DESC LIMIT 10, 10; ";
		const query = str1 + str2 + str3 + str4;
		console.log(query, 111);
		sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function (users) {
			console.log(users);
			res.send(resultMessage.success(users));
		});
	},
};
