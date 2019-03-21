module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      name: DataTypes.STRING,
      google_id: DataTypes.STRING,
      facebook_id: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    });

    User.associate = function(models) {
      // a user can have many orders
      User.hasMany(models.Order, {
        
      });
    };
    
    return User;
  };
  