var DataTypes = require("sequelize").DataTypes;
var _File = require("./File");
var _User = require("./User");

function initModels(sequelize) {
  var File = _File(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  File.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(File, { as: "Files", foreignKey: "user_id"});

  return {
    File,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
