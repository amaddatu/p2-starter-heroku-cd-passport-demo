module.exports = function(sequelize, DataTypes) {
  var OrderProduct = sequelize.define("OrderProduct", {
  });

  OrderProduct.associate = function(models) {
    // Order.belongsTo(User);
    // an order belongs to only 1 user
    // Order.belongsTo(models.User, {
    //   foreignKey: {
    //     allowNull: false
    //   }
    // });
  }
  
  return OrderProduct;
};
