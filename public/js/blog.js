$(document).ready(function() {
  /* global moment */

  // blogContainer holds all of our reviews
  var blogContainer = $(".review-container");
  var reviewCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleReviewDelete);
  $(document).on("click", "button.edit", handleReviewEdit);
  // Variable to hold our reviews
  var reviews;

  // The code below handles the case where we want to get blog reviews for a specific movie
  // Looks for a query param in the url for movie_id
  var url = window.location.search;
  var movieId;
  if (url.indexOf("?movie_id=") !== -1) {
    movieId = url.split("=")[1];
    getReviews(movieId);
  }
  // If there's no movieId we just get all reviews as usual
  else {
    getReviews();
  }


  // This function grabs reviews from the database and updates the view
  function getReviews(movie) {
    movieId = movie || "";
    if (movieId) {
      movieId = "/?movie_id=" + movieId;
    }
    $.get("/api/reviews" + movieId, function(data) {
      console.log("Reviews", data);
      reviews = data;
      if (!reviews || !reviews.length) {
        displayEmpty(movie);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete reviews
  function deleteReview(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/reviews/" + id
    })
      .then(function() {
        getReviews(reviewCategorySelect.val());
      });
  }

  // InitializeRows handles appending all of our constructed review HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    var reviewsToAdd = [];
    for (var i = 0; i < reviews.length; i++) {
      reviewsToAdd.push(createNewRow(reviews[i]));
    }
    blogContainer.append(reviewsToAdd);
  }

  // This function constructs a review's HTML
  function createNewRow(review) {
    var formattedDate = new Date(review.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newReviewCard = $("<div>");
    newReviewCard.addClass("card");
    var newReviewCardHeading = $("<div>");
    newReviewCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newReviewTitle = $("<h2>");
    var newReviewDate = $("<small>");
    var newReviewMovie = $("<h5>");
    newReviewMovie.text("Written by: " + review.Movie.name);
    newReviewMovie.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newReviewCardBody = $("<div>");
    newReviewCardBody.addClass("card-body");
    var newReviewBody = $("<p>");
    newReviewTitle.text(review.title + " ");
    newReviewBody.text(review.body);
    newReviewDate.text(formattedDate);
    newReviewTitle.append(newReviewDate);
    newReviewCardHeading.append(deleteBtn);
    newReviewCardHeading.append(editBtn);
    newReviewCardHeading.append(newReviewTitle);
    newReviewCardHeading.append(newReviewMovie);
    newReviewCardBody.append(newReviewBody);
    newReviewCard.append(newReviewCardHeading);
    newReviewCard.append(newReviewCardBody);
    newReviewCard.data("review", review);
    return newReviewCard;
  }

  // This function figures out which review we want to delete and then calls deleteReview
  function handleReviewDelete() {
    var currentReview = $(this)
      .parent()
      .parent()
      .data("review");
    deleteReview(currentReview.id);
  }

  // This function figures out which review we want to edit and takes it to the appropriate url
  function handleReviewEdit() {
    var currentReview = $(this)
      .parent()
      .parent()
      .data("review");
    window.location.href = "/cms?review_id=" + currentReview.id;
  }

  // This function displays a message when there are no reviews
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Movie #" + id;
    }
    blogContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("No reviews yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    blogContainer.append(messageH2);
  }

});
