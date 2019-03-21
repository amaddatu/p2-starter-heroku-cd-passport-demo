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

  // Load example page and pass in an example by id
  app.get("/order-form", function(req, res) {
      res.render("order-form", {
        jsScripts: "<script src='/js/order.js'></script>"
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
