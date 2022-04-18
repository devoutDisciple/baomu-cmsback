const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('video', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "视频的url"
    },
    photo: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "视频封面"
    },
    width: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "视频宽度"
    },
    height: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "视频高度"
    },
    duration: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "视频长度"
    },
    size: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "视频大小"
    },
    desc: {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: "视频描述"
    }
  }, {
    sequelize,
    tableName: 'video',
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
