const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('detail', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sub_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    detail_urls: {
      type: Sequelize.STRING(2000),
      allowNull: true,
      defaultValue: "[]",
      comment: "课程详情的图片"
    },
    teacher_urls: {
      type: Sequelize.STRING(2000),
      allowNull: true,
      defaultValue: "[]",
      comment: "师资团队的图片"
    },
    signup_urls: {
      type: Sequelize.STRING(2000),
      allowNull: true,
      defaultValue: "[]",
      comment: "报名须知的图片"
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
    tableName: 'detail',
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
