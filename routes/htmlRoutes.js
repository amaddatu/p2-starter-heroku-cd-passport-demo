var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    console.log(req.user);
    var email = "";
    if(typeof req.user !== 'undefined'){
      email = req.user.dataValues.email;
    }
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples,
        email: email
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Customer can create orders here
  app.get("/order-form", isLoggedIn, function(req, res) {
    db.Product.findAll({}).then( products => {
      res.render("order-form", {
        jsScripts: "<script src='/js/order.js'></script>",
        products: products
      });
    }).catch( err => {
      console.log(err);
      res.end(err.msg);
    });
    
  });
  // Manager can create products here
  app.get("/product-form", isAdmin, function(req, res) {
    res.render("product-form", {
      jsScripts: "<script src='/js/product.js'></script>"
    });
  });

  app.get("/account-order", isLoggedIn, function(req, res) {
    var user_id = req.user.dataValues.id;
    db.Order.findAll({
      where: {
        UserId: user_id
      }
    }).then( orders => {
      res.render("account-order", {
        user: {
          id: user_id
        },
        orders: orders,
        jsScripts: "<script src='/js/order.js'></script>"
      });
    }).catch( err => {
      console.log(err);
      res.json(false);
    });
    
  });

  app.get("/list-orders", isAdmin, function(req, res){
    db.Order.findAll({
      order: [
        ['id', 'DESC']
      ],
      include: [{
        model: db.Product,
        as: 'Items',
        through: {
          attributes: ['price', 'quantity']
        }
      }]
    })
    .then( orders => {
      console.log(JSON.stringify(orders, null, 2));
      res.render("list-orders", {
        title: "List Orders",
        jsScripts: "<script src='/js/order.js'></script>",
        orders: orders
      });
    })
    .catch( error => {
      console.log(error);
      res.json(error.msg);
    });
  });

  function isLoggedIn(req, res, next) {
    // if user is authenticated, we'll all float on OK
    if (req.isAuthenticated()) {
      return next();
    }
    // otherwise, redirect them to the login page
    res.redirect('/');
  }

  function isAdmin(req, res, next) {
    // if user is authenticated, we'll all float on OK
    if (req.isAuthenticated() && req.user.dataValues.admin) {
      console.log(req.user.dataValues);
      return next();
    }
    // otherwise, redirect them to the login page
    res.redirect('/');
  }

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
