const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('school', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    idcard: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "身份证号"
    },
    school_name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "学校名称"
    },
    graduation_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "毕业时间"
    },
    study_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "学习形式"
    },
    certificate_gov: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "证书颁发机构"
    },
    certificate_name: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "证书名称"
    },
    certificate_level: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "名次"
    },
    certificate_time: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "证书颁发时间"
    },
    school_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "毕业证书图片"
    },
    award_url: {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "获奖证书图片"
    },
    state: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "认证状态 1-未认证 2-认证中 3-认证失败 4-认证成功"
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
    tableName: 'school',
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
