var db = require("../models");

module.exports = function(app, passport) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  app.get('/_auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));
 
  app.get('/_auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  // Create a new order
  app.post("/api/order",
  function(req, res) {
    if(typeof req.user !== 'undefined'){
      // email = req.user.dataValues.email;
      console.log(req.user.dataValues);
      var orderData = req.body;
      orderData.UserId = req.user.dataValues.id;
      // console.log(orderData['product-id']);
      // console.log(orderData['quantity']);
      console.log(req.body);
      // delete orderData['items'];
      // delete orderData['product-id'];
      // delete orderData['quantity'];
      db.Order.create(orderData).then(function(dbOrder) {
        console.log(dbOrder.dataValues);
        addProductToOrderHelper(orderData['items'], 0, dbOrder.dataValues.id, function(){
          res.json(true);
        });
      });
      
    }
    else{
      res.json(false);
    }
  });

  // for (var i = 0; i < items.length; i++){

  // }
  function addProductToOrderHelper(items, index, orderId, cb){
    if(index >= items.length){
      return cb();
    }
    var itemId = items[index].itemId;
    var quantity = items[index].quantity;
    if(quantity > 0){
      db.Product.findOne({
        where: {
          id: itemId
        }
      }).then( dbProduct => {
        var price = dbProduct.dataValues.price;
        console.log(dbProduct.dataValues);
        return db.OrderProduct.create({
          ProductId: itemId,
          OrderId: orderId,
          quantity: quantity,
          price: price
        });
      }).then( dbProductOrder => {
        console.log(dbProductOrder.dataValues);
        // add 1 to index
        index++;
        // recursive call will go to the next item in the list
        addProductToOrderHelper(items, index, orderId, cb);
      }).catch( error => {
        console.log("err");
        // add 1 to index
        index++;
        // recursive call will go to the next item in the list
        addProductToOrderHelper(items, index, orderId, cb);
      });
    }
    else{
      // add 1 to index
      index++;
      // recursive call will go to the next item in the list
      addProductToOrderHelper(items, index, orderId, cb);
    }
  }
  // Create a new order
  app.post("/api/product",
  isAdmin,
  function(req, res) {
    // email = req.user.dataValues.email;
    // console.log(req.user.dataValues);
    // console.log(req.body);
    // res.json(req.body);
    db.Product.create(req.body)
    .then((result) => {
      res.json(req.body);
    })
    .catch((error) => {
      console.log(error);
      res.json(false);
    });
  });

  
  // this is NOT SECURE ... remove in production
  app.get("/_api/account-make-admin", isLoggedIn, function(req, res){
    if(process.env.NODE_ENV === 'development'){
      var user_id = req.user.dataValues.id;
      db.User.update({
        admin: true
      }, {
        where: {
          id: user_id
        }
      }).then((result) => {
        res.redirect('/');
      }).catch((err) => {
        console.log(err);
        res.json(false);
      });
    }
    else{
      res.json(false);
    }
  });

  function isLoggedIn(req, res, next) {
    // if user is authenticated, we'll all float on OK
    if (req.isAuthenticated()) {
      return next();
    }
    // otherwise, redirect them to the login page
    res.end('error');
  }

  function isAdmin(req, res, next) {
    // if user is authenticated, we'll all float on OK
    if (req.isAuthenticated() && req.user.dataValues.admin) {
      return next();
    }
    // otherwise, redirect them to the login page
    res.end('error');
  }
};
