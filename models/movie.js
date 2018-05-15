module.exports = function(sequelize, DataTypes) {
  var Movie = sequelize.define("Movie", {
    // Giving the Movie model a name of type STRING
    color: DataTypes.STRING,
    director_name: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    actor_2_name: DataTypes.STRING,
    gross: DataTypes.STRING,
    genres: DataTypes.STRING,
    actor_1_name: DataTypes.STRING,    
    movie_title: DataTypes.STRING,
    actor_3_name: DataTypes.STRING,
    plot_keywords: DataTypes.STRING,
    movie_imdb_link: DataTypes.STRING,
    language: DataTypes.STRING,
    country: DataTypes.STRING,
    content_rating: DataTypes.STRING,
    budget: DataTypes.BIGINT,
    title_year: DataTypes.INTEGER,
    imdb_score: DataTypes.INTEGER,
    aspect_ratio: DataTypes.INTEGER,
  },
  {
    "timestamps": false
  });

  // Table headings
  //  color,director_name,duration,actor_2_name,gross,genres,actor_1_name,movie_title,actor_3_name,plot_keywords,movie_imdb_link,language,country,content_rating,budget,title_year,imdb_score,aspect_ratio


  Movie.associate = function(models) {
    // Associating Movie with Reviews
    // When an Movie is deleted, also delete any associated Reviews
    Movie.hasMany(models.Review, {
      onDelete: "cascade"
    });
  };

  return Movie;
};
