const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('goods_record', {
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
    other_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "发布人的id"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-帖子赞 2-评论赞 3-评论的评论"
    },
    content_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "帖子，博客，投票，pk的id"
    },
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "评论id"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'goods_record',
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
