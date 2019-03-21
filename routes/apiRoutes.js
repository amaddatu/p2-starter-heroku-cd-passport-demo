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
      db.Order.create(orderData).then(function(dbOrder) {
        res.json(true);
      });
    }
    else{
      res.json(false);
    }
  });

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
