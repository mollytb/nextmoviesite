$(document).ready(function() {
  // Getting jQuery references to the review body, title, form, and movie select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  var movieSelect = $("#movie");
  $("#movie").show();
  $("#movie-label").show();

  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're up-dating a review)
  var url = window.location.search;
  var reviewId;
  var movieId;
//  var memberId;
  // Sets a flag for whether or not we're up-dating a review to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the review id from the url
  // In '?review_id=1', reviewId is 1
  if (url.indexOf("?review_id=") !== -1) {
    reviewId = url.split("=")[1];
    getReviewData(reviewId, "review");
  }
  // Otherwise if we have an movie_id in our url, preset the movie select box to be our Movie
  else if (url.indexOf("?member_id=") !== -1) {
    memberId = url.split("=")[1];
    getMemberData(memberId, "member");
    getReviews();
  }
  // Otherwise if we have an movie_id in our url, preset the movie select box to be our Movie
  else if (url.indexOf("?movie_id=") !== -1) {
    movieId = url.split("=")[1];
    getMovie(movieId);
  }
  else
  {
    getMovies();
  }

  // A function for handling what happens when the form to create a new review is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the review if we are missing a body, title, or movie
    var bodyField = $("#body").val().trim();
    var movieField = $("#movie option:selected").text();
    var titleField = $("#title").text().trim();

    if (!movieField || !bodyField ) {
      return;
    }
    // If initial creation use the movie slection field for the title
    if (!updating)
       titleField = movieField;

    // Constructing a newReview object to hand to the database
    var newReview = {
      title: titleField,
      body: bodyField
    };
    // Note: The title field is re-purposed to hold the movie name
    //       A seperated MoviesID foreign Key field was orignally designed.
    //       This implementation is an interim solution.
    //       The MemberID field commented out was also included
    //       Actually probably the direction we need to go is to use the
    //       serarch routes (since the TITEL case the actual movie title text)
    //       We still want the selection box to end up just showing the one
    //       correct movie entry associated with the review.

    // If we're up-dating a review run updateReview to update a review
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
      window.location.href = "/review";
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
 //   case "member":
 //     queryUrl = "/api/members/" + id;
    default:
      return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.MovieId || data.id);
        // If this review exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        if ((data.MovieId == null) && ((parseInt(data.title))))        
            movieId = data.title;
        else
            movieId = data.MovieId || data.id;
//        memberId = data.MemberId;
        // If we have a review with this id, set a flag for us to know to update the review
        // when we hit submit
        updating = true;

        $("#marque-title").text(data.title);
        $("#movie").hide();
        $("#movie-label").hide();

//        // Finally call the get movie method to fill in the movie list
//        getMovie(movieId);

        // Note: The above needs tp chnage to be mre like the reviews where we 
        //       differentiate between the type of IDs, still trying to 
        //       get the 'Movie' id saved previously in title to render the selection
        //       The route returns the 3 random ones instead.
        //       The above call when called from a review that has been corrected(title field now has the titel of the  move)
        //       ends up calling the above method with movieID set to the reviewID which wont work

        // Decided that for Update purposes, not chaanging Movie ID
      }
    });
  }

  // A function to get Movies and then render our list of Movies
  function getMovies() {
    console.log('getMovies called');
    $.get("/api/movies", renderMovieList);
  }

  // A function to get Movies and then render our list of Movies
  function getMovie(id) {
    console.log('getMovie called');
    var queryUrl = "/api/movies/"+id;
    $.get(queryUrl, renderMovie);
  }

  // Function to either render a list of movies, or if there are none, direct the user to the page
  // to create an movie first
  function renderMovieList(data) {
    console.log('renderMovieList called');
    if (!data.length) {
      window.location.href = "/cms";
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
//    movieSelect.value(movieId);
  }

// Function to either render a single movies for the selection
// It is called for cases in which the Movie is allready known and no selection is needed.
  function renderMovie(movie) {
    console.log('renderMovie called');
    if (!movie.length) {
      // If for sany reason we did not get movie data, get the MovieID from the URL and call the paga again
      window.location.href = "/cms/?movie_id=" + movieId;
      // setting the href above allows the input select dropdown to 
      // include the prevously requested movie
    }
    $(".hidden").removeClass("hidden");
    var rowToAdd = [];
    rowToAdd.push(createMovieRow(movie[0]));
    
    movieSelect.empty();
    console.log(rowToAdd);
    console.log(movieSelect);
    movieSelect.append(rowToAdd);
//    movieSelect.value(movie.id);
  }

  // Creates the movie options in the dropdown
  function createMovieRow(movie) {
    var listOption = $("<option>");
    listOption.attr("value", movie.id);
    listOption.text(movie.movie_title);
    return listOption;
  }

// A function to get Members and then render our list of Movies
// function getMembers() {
//  console.log('getMembers called');
//  $.get("/api/movies", renderMovieList);
//}
//// Function to either render a list of movies, or if there are none, direct the user to the page
//// to create an movie first
//function renderMemberList(data) {
//  console.log('renderMemberList called');
//  if (!data.length) {
//    window.location.href = "/members";
//  }
//  $(".hidden").removeClass("hidden");
//  var rowsToAdd = [];
//  for (var i = 0; i < data.length; i++) {
//    rowsToAdd.push(createMemberRow(data[i]));
//  }
//  memberSelect.empty();
//  console.log(rowsToAdd);
//  console.log(memberSelect);
//  memberSelect.append(rowsToAdd);
//  memberSelect.val(memberId);
//}

//// Creates the movie options in the dropdown
//function createMemberRow(movie) {
//  var listOption = $("<option>");
//  listOption.attr("value", member.id);
//  listOption.text(member.name);
//  return listOption;
//}


  // Update a given review, bring user to the reviews page when done
  function updateReview(review) {
    $.ajax({
      method: "PUT",
      url: "/api/reviews",
      data: review
    })
      .then(function() {
        window.location.href = "/review";
      });
  }
});
