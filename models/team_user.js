const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('team_user', {
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
    team_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "团队id"
    },
    user_table_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "对应的user表的id"
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: -1,
      comment: "乐队的担当 -1: 未知"
    },
    state: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-未参与(邀请阶段) 2-参与 3-已经拒绝"
    },
    is_owner: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 2,
      comment: "是否是拥有着 1-是 2-不是"
    },
    join_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "参与时间"
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
    tableName: 'team_user',
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
