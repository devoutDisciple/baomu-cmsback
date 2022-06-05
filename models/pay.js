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
      comment: "发起人的用户id"
    },
    open_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "发起人的用户openid"
    },
    demand_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "对应需求的id"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-商户付款 2-系统付款给演员 3-系统退款给商户 4-系统退款给用户"
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
    batch_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "系统转账的-微信批次单号，微信商家转账系统返回的唯一标识"
    },
    out_batch_no: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "系统转账的-商户系统内部的商家批次单号"
    },
    out_detail_no: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "系统转账的-商户系统内部区分转账批次单下不同转账明细单的唯一标识"
    },
    batch_status: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "系统转账的-状态 WAIT_PAY：待付款 ACCEPTED:已受理 PROCESSING:转账中 FINISHED：已完成 CLOSED：已关闭"
    },
    batch_detail_status: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "系统转账的-明细状态   PROCESSING：转账中 SUCCESS：转账成功 FAIL：转账失败"
    },
    money: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "金额 单位分"
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
