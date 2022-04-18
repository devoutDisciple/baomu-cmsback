const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('level', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "用户id"
    },
    school_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "证书颁发机构的id"
    },
    level_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "证书等级"
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "获奖时间"
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "证书图片"
    },
    state: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "认证状态 1-未认证 2-认证中 3-认证失败 4-认证成功"
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
    tableName: 'level',
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
