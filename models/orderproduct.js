module.exports = function(sequelize, DataTypes) {
  var OrderProduct = sequelize.define("OrderProduct", {
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2)
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
