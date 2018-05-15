$(document).ready(function() {
  // Getting jQuery references to the review body, title, form, and movie select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  var movieSelect = $("#movie");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a review)
  var url = window.location.search;
  var reviewId;
  var movieId;
  // Sets a flag for whether or not we're updating a review to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the review id from the url
  // In '?review_id=1', reviewId is 1
  if (url.indexOf("?review_id=") !== -1) {
    reviewId = url.split("=")[1];
    getReviewData(reviewId, "review");
  }
  // Otherwise if we have an movie_id in our url, preset the movie select box to be our Movie
  else if (url.indexOf("?movie_id=") !== -1) {
    movieId = url.split("=")[1];
  }

  // Getting the movies, and their reviews
  getMovies();

  // A function for handling what happens when the form to create a new review is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the review if we are missing a body, title, or movie
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !movieSelect.val()) {
      return;
    }
    // Constructing a newReview object to hand to the database
    var newReview = {
      title: titleInput
        .val()
        .trim(),
      body: bodyInput
        .val()
        .trim(),
      MovieId: movieSelect.val()
    };

    // If we're updating a review run updateReview to update a review
    // Otherwise run submitReview to create a whole new review
    if (updating) {
      newReview.id = reviewId;
      updateReview(newReview);
    }
    else {
      submitReview(newReview);
    }
  }

  // Submits a new review and brings user to blog page upon completion
  function submitReview(review) {
    console.log('submitReview (' + review + ') called'); 
    $.post("/api/reviews", review, function() {
      window.location.href = "/blog";
    });
  }

  // Gets review data for the current review if we're editing, or if we're adding to an movie's existing reviews
  function getReviewData(id, type) {
    var queryUrl;
    console.log('getReviewData ' + id + ',' + type +')');
    switch (type) {
    case "review":
      queryUrl = "/api/reviews/" + id;
      break;
    case "movie":
      queryUrl = "/api/movies/" + id;
      break;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.MovieId || data.id);
        // If this review exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        movieId = data.MovieId || data.id;
        // If we have a review with this id, set a flag for us to know to update the review
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Movies and then render our list of Movies
  function getMovies() {
    console.log('getMovies called');
    $.get("/api/movies", renderMovieList);
  }
  // Function to either render a list of movies, or if there are none, direct the user to the page
  // to create an movie first
  function renderMovieList(data) {
    console.log('renderMovieList called');
    if (!data.length) {
      window.location.href = "/movies";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createMovieRow(data[i]));
    }
    movieSelect.empty();
    console.log(rowsToAdd);
    console.log(movieSelect);
    movieSelect.append(rowsToAdd);
    movieSelect.val(movieId);
  }

  // Creates the movie options in the dropdown
  function createMovieRow(movie) {
    var listOption = $("<option>");
    listOption.attr("value", movie.id);
    listOption.text(movie.movie_title);
    return listOption;
  }

  // Update a given review, bring user to the blog page when done
  function updateReview(review) {
    $.ajax({
      method: "PUT",
      url: "/api/reviews",
      data: review
    })
      .then(function() {
        window.location.href = "/blog";
      });
  }
});
