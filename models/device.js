const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('device', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "发布人id"
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "工作室名称"
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "开始时间"
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "结束时间"
    },
    img_urls: {
      type: Sequelize.STRING(800),
      allowNull: true,
      defaultValue: "[]",
      comment: "设备图片"
    },
    price: {
      type: Sequelize.STRING(11),
      allowNull: true,
      comment: "价格"
    },
    desc: {
      type: Sequelize.STRING(8000),
      allowNull: true,
      comment: "简介"
    },
    is_authentication: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "专业设备认证 1-认证 2-不认证"
    },
    grade: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "5.0",
      comment: "评分"
    },
    comment_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "评论数量"
    },
    goods_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "点赞数量"
    },
    province: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "省份"
    },
    city: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "城市"
    },
    addressAll: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "详细地址"
    },
    addressName: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "缩略地点"
    },
    latitude: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    longitude: {
      type: Sequelize.STRING(255),
      allowNull: true
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
      comment: "是否存在 1-存在 2-不存在"
    }
  }, {
    sequelize,
    tableName: 'device',
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
