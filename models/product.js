module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL(10,2)
  });

  Product.associate = function(models) {
    // Order.belongsTo(User);
    // an order belongs to only 1 user
    // Order.belongsTo(models.User, {
    //   foreignKey: {
    //     allowNull: false
    //   }
    // });
    // Product.belongsToMany(models.Order, { as: "Orders", through: "OrderProduct", foreignKey: "ProductId"});
  }
  
  return Product;
};
