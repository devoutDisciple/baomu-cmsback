const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('order', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "用户id"
    },
    open_id: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    team_uuid: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "拼团的uuid"
    },
    out_trade_no: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true,
      comment: "内部订单号"
    },
    transaction_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "微信支付单号"
    },
    subject_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "课程id"
    },
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "班级id"
    },
    pay_state: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "1-已支付 2-已退款 其他"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-报名 2-组团"
    },
    english: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-英语一 2：英语二"
    },
    math: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-数学一 2-数学二 3-数学三"
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "真实姓名"
    },
    sex: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1-男 2-女"
    },
    time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "入学时间"
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
    tableName: 'order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "out_trade_no" },
        ]
      },
    ]
  });
};
