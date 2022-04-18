const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('comment_record', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "用户id"
    },
    content_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "点赞的帖子，博客，投票，pk的id"
    },
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "评论的id"
    },
    img_urls: {
      type: Sequelize.STRING(3000),
      allowNull: true,
      defaultValue: "[]",
      comment: "图片的urls"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-给帖子评论 2-二级评论 "
    },
    desc: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "评论内容"
    },
    goods_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "点赞数量"
    },
    share_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "分享次数"
    },
    comment_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "评论数量"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    update_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "修改时间"
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-存在 2-删除"
    }
  }, {
    sequelize,
    tableName: 'comment_record',
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
