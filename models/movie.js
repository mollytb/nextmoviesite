module.exports = function(sequelize, DataTypes) {
  var Movie = sequelize.define("Movie", {
    // Giving the Movie model a name of type STRING
    name: DataTypes.STRING
  });

  Movie.associate = function(models) {
    // Associating Movie with Reviews
    // When an Movie is deleted, also delete any associated Reviews
    Movie.hasMany(models.Review, {
      onDelete: "cascade"
    });
  };

  return Movie;
};
