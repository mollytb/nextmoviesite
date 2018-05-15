var db = require("../models");

module.exports = function(app) {
  app.get("/api/movies", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    db.Movie.findAll({
   //   include: [db.Review]
    }).then(function(dbMovie) {
      res.json(dbMovie);
    });
  });

  app.get("/api/movies/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    db.Movie.findOne({
      where: {
        id: req.params.id
      },
//      include: [db.Review]
    }).then(function(dbMovie) {
      res.json(dbMovie);
    });
  });

  app.post("/api/movies", function(req, res) {
    db.Movie.create(req.body).then(function(dbMovie) {
      res.json(dbMovie);
    });
  });

  app.delete("/api/movies/:id", function(req, res) {
    db.Movie.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbMovie) {
      res.json(dbMovie);
    });
  });

};
