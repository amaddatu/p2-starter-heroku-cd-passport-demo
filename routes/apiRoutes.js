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

  
};
