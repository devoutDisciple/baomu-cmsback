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
      allowNull: false,
      comment: "用户id"
    },
    open_id: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    demand_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "对应需求的id"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-商户付款 2-付款给演员 3-退款给商户 4-退款给用户"
    },
    pay_type: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "1",
      comment: "1-付款 2-退款 3-其他"
    },
    out_trade_no: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "支付-商户系统内部订单号"
    },
    transaction_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "支付-微信支付订单号"
    },
    trade_state: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "支付-支付状态"
    },
    out_refund_no: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "退款-退款单号"
    },
    refund_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "退款-微信内部退款单号"
    },
    refund_status: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "退款-退款状态"
    },
    money: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "金额"
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
