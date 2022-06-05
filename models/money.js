const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('money', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "用户id"
    },
    pay_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "pay表中的id"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-演出所得 2-退款所得 3-金额提现"
    },
    total_money: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "总金额"
    },
    real_money: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "扣除手续费的实际金额"
    },
    rate: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "税率"
    },
    rate_money: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "扣除税率金额"
    },
    demand_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "演出的id"
    },
    state: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "提现时候才有的状态 PROCESSING：转账中 SUCCESS：转账成功 FAIL：转账失败"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-存在2-删除"
    }
  }, {
    sequelize,
    tableName: 'money',
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
