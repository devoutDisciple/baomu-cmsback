const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('skill', {
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
    skill_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "技能id"
    },
    grade: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "评分"
    },
    state: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "技能状态 1-未认证 2-认证中 3-认证失败 4-认证成功"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'skill',
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
