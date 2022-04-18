const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('data', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_total: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "会员总数"
    },
    user_today: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "今日新增"
    },
    publish_total: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "发布总数"
    },
    publish_today: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "今日发布"
    },
    goods_total: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "点赞总数"
    },
    goods_today: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "今日新增"
    },
    comment_total: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "评论总数"
    },
    comment_today: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "今日新增"
    },
    share_total: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "分享总数"
    },
    share_today: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "今日新增"
    },
    online_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "当前在线人数"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'data',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
