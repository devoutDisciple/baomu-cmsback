var Sequelize = require("sequelize").Sequelize;
var _account = require("./account");
var _detail = require("./detail");
var _order = require("./order");
var _pay = require("./pay");
var _project = require("./project");
var _subject = require("./subject");
var _swiper = require("./swiper");
var _teacher = require("./teacher");
var _team = require("./team");
var _type = require("./type");
var _user = require("./user");

function initModels(sequelize) {
  var account = _account(sequelize, Sequelize);
  var detail = _detail(sequelize, Sequelize);
  var order = _order(sequelize, Sequelize);
  var pay = _pay(sequelize, Sequelize);
  var project = _project(sequelize, Sequelize);
  var subject = _subject(sequelize, Sequelize);
  var swiper = _swiper(sequelize, Sequelize);
  var teacher = _teacher(sequelize, Sequelize);
  var team = _team(sequelize, Sequelize);
  var type = _type(sequelize, Sequelize);
  var user = _user(sequelize, Sequelize);


  return {
    account,
    detail,
    order,
    pay,
    project,
    subject,
    swiper,
    teacher,
    team,
    type,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
