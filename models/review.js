module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define("Review", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    }
  });

  Review.associate = function(models) {
    // We're saying that a Review should belong to a Movie
    // A Review can't be created without a Movie due to the foreign key constraint
    Review.belongsTo(models.Movie, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Review;
};
