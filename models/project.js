const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('project', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    type_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "所属类别id"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "排序"
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
    tableName: 'project',
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
