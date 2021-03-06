var db = require("../models");
var Sequelize = require("sequelize");
const {gt, or, and, lte, ne, in: opIn} = Sequelize.Op;

module.exports = function (app) {
  app.get("/api/movies", function (req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    console.log("Running Random 3 Query!!!");
    db.Movie.findAll({
      order: [
      [Sequelize.fn('RAND')]
    ],
      limit: 3,
      include: [db.Review]
    }).catch((err) => console.log(err)).then(function (dbMovie) {
      res.json(dbMovie);
    });
  });

  app.get("/api/movies/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Review
    console.log("Running Search Query!!!");
    db.Movie.findAll({
      where: {
        [or]: [{
            actor_1_name: req.params.id
          },
          {
            actor_2_name: req.params.id
          },
          {
            actor_3_name: req.params.id
          },
          {
            director_name: req.params.id
          },
          {
            movie_title: req.params.id
          },
          {
            id: req.params.id
          } 
        ]
      },
      include: [db.Review]
    }).catch((err) => console.log(err)).then(function (dbMovie) {
      res.json(dbMovie);
      //console.log(res.json(dbMovie.movie_title));
    });
  });

  app.post("/api/movies", function (req, res) {
    db.Movie.create(req.body).then(function (dbMovie) {
      res.json(dbMovie);
    });
  });

  // Note: Deleting movies is not allowed so no route for it at this time.

};
