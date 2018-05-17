var db = require("../models");
var Sequelize = require("sequelize");
const {gt, or, and, lte, ne, in: opIn} = Sequelize.Op;

module.exports = function (app) {
  app.get("/api/movies", function (req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    db.Movie.findAll({
      where: {
        imdb_score: {
          [gt]: 9
        },
      }
      //   include: [db.Review]
    }).then(function (dbMovie) {
      res.json(dbMovie);
    });
  });

  app.get("/api/movies/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    db.Movie.findOne({
      where: {
        movie_title: req.params.id
      },
      //      include: [db.Review]
    }).then(function (dbMovie) {
      res.json(dbMovie);
    });
  });
  app.get("/api/movies/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    db.Movie.findOne({
      where: {
        [or]: [{
            actor_1_name: req.params.id
          },
          {
            actor_2_name: req.params.id
          },
          {
            actor_3_name: req.params.id
          }
        ]

      }

      //      include: [db.Review]
    }).then(function (dbMovie) {
      res.json(dbMovie);
    });
  });

  app.post("/api/movies", function (req, res) {
    db.Movie.create(req.body).then(function (dbMovie) {
      res.json(dbMovie);
    });
  });

  app.delete("/api/movies/:id", function (req, res) {
    db.Movie.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbMovie) {
      res.json(dbMovie);
    });
  });

};
