const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('demand', {
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
    team_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "被邀请的团队的id"
    },
    user_type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-个人 2-乐队 3-乐团"
    },
    join_ids: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "参与竞价的人的id,用逗号分开"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-发布的需求 2-邀请的需求"
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "需求名称"
    },
    play_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "演奏方式"
    },
    instrument_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "乐器id"
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "演出开始时间"
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "演出结束时间"
    },
    hours: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "每天演出时间"
    },
    addressAll: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "演出详细地点"
    },
    addressName: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "演出缩略地点"
    },
    longitude: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "地点纬度"
    },
    latitude: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "地点经度"
    },
    is_bargain: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "是否议价 1-是 2-否"
    },
    is_send: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "是否接送 1-是 2-否"
    },
    is_food: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "是否包食宿 1-是 2-否"
    },
    desc: {
      type: Sequelize.STRING(800),
      allowNull: true,
      comment: "演出简介"
    },
    price: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "用户设置的演出费用"
    },
    grade: {
      type: Sequelize.STRING(11),
      allowNull: true,
      defaultValue: "0",
      comment: "评分"
    },
    state: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-竞价进行中 2-竞价结束，需求进行中（未支付） 3-需求进行中（已支付） 4-需求取消  5-待付款给用户 6-交易成功(未评价) 7-交易成功（已评价） 8-交易取消"
    },
    final_user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "最终确定人的id"
    },
    final_price: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "最终确定价格"
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
      comment: "是否删除 1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'demand',
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
