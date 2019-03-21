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
  app.get("/order-form", function(req, res) {
      res.render("order-form", {
        jsScripts: "<script src='/js/order.js'></script>"
      });
  });

  app.get("/account-order", isLoggedIn, function(req, res) {
    var user_id = req.user.dataValues.id;
    db.Order.findAll({
      UserId: user_id
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
    })
    
  });

  // this is NOT SECURE ... remove in production
  app.get("/account-make-admin", isLoggedIn, function(req, res){
    var user_id = req.user.dataValues.id;
    db.User.update({
      admin: true
    }, {
      where: {
        id: user_id
      }
    }).then((result) => {
      res.json(true);
    }).catch((err) => {
      console.log(err);
      res.json(false);
    })
  });

  function isLoggedIn(req, res, next) {
    // if user is authenticated, we'll all float on OK
    if (req.isAuthenticated()) {
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
