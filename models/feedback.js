const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('feedback', {
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
    plate_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "模块id"
    },
    desc: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "描述内容"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-圈子反馈 2-意见反馈"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    is_delete: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'feedback',
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
