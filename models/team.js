const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('team', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    team_uuid: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    user_ids: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "成员id"
    },
    ower_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "队长id"
    },
    user_table_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "对应的用户表的id"
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "团队名称"
    },
    photo: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "团队头像"
    },
    bg_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "背景图片"
    },
    style_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "风格id"
    },
    desc: {
      type: Sequelize.STRING(800),
      allowNull: true,
      comment: "简介"
    },
    latitude: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "经度"
    },
    longitude: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "纬度"
    },
    province: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "省份"
    },
    city: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "城市"
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "个人签名"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'team',
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
