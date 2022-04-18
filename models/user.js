const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    wx_openid: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "手机号"
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "用户名称"
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "密码"
    },
    photo: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "https:\/\/www.chiangky.com\/photo\/photo.png",
      comment: "头像"
    },
    bg_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "背景图片"
    },
    birthday: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "生日"
    },
    sex: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1- 男 2-女"
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "地址"
    },
    sign: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "个性签名"
    },
    integral: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "积分"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    update_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "更新时间"
    },
    disable: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "是否可用 1-可用 2-封禁"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'user',
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
