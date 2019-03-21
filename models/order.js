module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define("Order", {
    description: DataTypes.STRING
  });

  Order.associate = function(models) {
    // Order.belongsTo(User);
    // an order belongs to only 1 user
    Order.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });

    // Order.belongsToMany(models.Product, { as: "Items", through: "orderproducts", foreignKey: "OrderId"});
  }
  
  return Order;
};
