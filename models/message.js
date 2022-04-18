const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('message', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "发送人的id"
    },
    person_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "接收人的id"
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "发送人的名称"
    },
    user_photo: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "发送人的图片"
    },
    content: {
      type: Sequelize.STRING(1000),
      allowNull: true,
      comment: "发送的内容"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-用户消息 2-系统通知 3-订单推送信息 4-邀请信息"
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
    tableName: 'message',
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
