module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      name: DataTypes.STRING,
      google_id: DataTypes.STRING,
      facebook_id: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    });
    return User;
  };
  