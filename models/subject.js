const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('subject', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "所属的课程的id"
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "title"
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
    teacher_ids: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "[]",
      comment: "授课老师的id"
    },
    price: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "总价"
    },
    apply_price: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "报名价格"
    },
    cluster_price: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: "0",
      comment: "组团价格"
    },
    total_person: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "总报名人数"
    },
    apply_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "报名人数"
    },
    cluster_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "组团人数"
    },
    limit_num: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "限制人数"
    },
    state: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-未开始 2-进行中 3-已结束"
    },
    tags: {
      type: Sequelize.STRING(800),
      allowNull: true,
      defaultValue: "[]",
      comment: "标签"
    },
    sort: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1
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
    tableName: 'subject',
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
