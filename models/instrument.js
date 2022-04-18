const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('instrument', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "乐器名称"
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "乐器图片"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "排序"
    },
    create_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "创建时间"
    }
  }, {
    sequelize,
    tableName: 'instrument',
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
