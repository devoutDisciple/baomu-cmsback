const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('pay', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    open_id: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-报名费用 2-组团费用"
    },
    pay_type: {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: "1",
      comment: "1-付款 2-退款 3-其他"
    },
    out_trade_no: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "商户系统内部订单号"
    },
    transaction_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "微信支付订单号"
    },
    trade_state: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "支付状态"
    },
    money: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "支付金额"
    },
    success_time: {
      type: Sequelize.DATE,
      allowNull: false,
      comment: "支付成功时间"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: false,
      comment: "创建时间"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'pay',
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
