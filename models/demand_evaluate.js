const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('demand_evaluate', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    demand_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "需求id"
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "评价的用户"
    },
    publisher_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "发布方的id"
    },
    grade: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "评分"
    },
    desc: {
      type: Sequelize.STRING(800),
      allowNull: true,
      comment: "描述"
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
    tableName: 'demand_evaluate',
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
