$(document).ready(function() {

  // Until review search is all working, hide.
  $(".search-review-label").hide();
  $(".search-review-form").hide();

  // Getting references to the name input and review container, as well as the table body

  var reviewList = $("tbody.review-list");
  var reviewContainer = $(".review-container");
  var movieSelect = $("#movies");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an review
  //  getReviews(movieSelect);
  $(document).on("submit", "#review-form", handleReviewFormSubmit);
  $(document).on("click", ".delete-review", handleDeleteButtonPress);
  $(document).on("click", ".edit-review", handleEditButtonPress);

  // A function to handle what happens when the form is submitted to create a new Review
  function handleReviewFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!movieSelect.val().trim().trim()) {
      return;
    }

    // The code below handles the case where we want to get blog posts for a specific author
    // Looks for a query param in the url for author_id
    var url = window.location.search;
    var movieId;
    if (url.indexOf("?movie_id=") !== -1) {
      movieId = url.split("=")[1];
      getReviews(movieId);
    }
    // If there's no movieId we just get all reviews as usual
    else {
      getReviewss();
    }
  }


    // Calling the insertReview function and passing in the value of the name input
    inputReview(movieSelect.val());

    // Note: The above call transfer control
    // to the cms 'review' handler for
    // the actual creation of reviews
    // As it currently supports the
    // the fields for inputing text
    // There is probably a better way
    // To do this, but it works for now...

    var searchInput = "avatar";
    //var movieID = $("#searchInput");
    //console.log(searchInput);
    

    $("#search").on("click", function (event) {
        event.preventDefault();
        var searchInput = $("#searchInput")
            .val()
            .trim();
        searchInput = searchInput.replace(/\s+/g, "").toLowerCase();
        //searchInput = searchInput.stringify();

        console.log(searchInput)
        getReviews(searchInput);    
    });

 //   function getReviews(movie) {
 //     console.log(movie);
 //     movieId = movie || "";
 //     if (movieId) {
 //       movieId = "/?movie_id=" + movieId;
 //     }  
 //     $.get("/api/reviews" + movieId, function (data, err, cb) {
 //         //searchInput.val.trim();
 //         console.log(data);
 //         var rowsToAdd = [];
 //         for (var i = 0; i < data.length; i++) {
 //             rowsToAdd.push(createReviewRow(data[i]));
 //         }
 //        // createMovieRow(data);
 //         renderReviewList(rowsToAdd);
 //         //nameInput.val("");
 //     });
 //   }
 // }

  // Getting the initial list of Reviews
  getReviews();

  // A function for creating a review vis cms input form. Calls getReviews upon completion
  function inputReview(movie) {
    $.post("/api/reviews", movie)
      .then(getReviews);
  }

  // A function for creating a review. Calls getReviews upon completion
  function insertReview(reviewData) {
    $.post("/api/reviews", reviewData)
      .then(getReviews);
  }

  // Function for creating a new list row for reviews
  function createReviewRow(reviewData) {    
    var newTr = $("<tr>");
    newTr.data("review", reviewData);
    newTr.append("<td>" + reviewData.title + "</td>");
    newTr.append("<td>" + reviewData.body + "</td>" );
// Note: Model does not currently support additional fields
    newTr.append("<td><a style='cursor:pointer;color:blue' href='/cms?review_id=" + reviewData.id + "'>Edit</a></td>");
//    newTr.append("<td><a class='edit-review'>Edit</a></td>"); 
//    newTr.append("<td><a class='delete-review'>Delete</a></td>"); 
    newTr.append("<td><a style='cursor:pointer;color:blue' class='delete-review'>Delete</a></td>"); 
    return newTr;
  }

  function findMovieTitle(id) {
    console.log(id);

    $.get("/api/movies/" + id, function (movieData, err, cb) {
        return movieData.movie_title;
    });
  }



  // Function for retrieving all reviews or one review for a certain movie
  function getReviews(movie) {
    movieId = movie || "";
    if (movieId) {
      movieId = "/?movie_id=" + movieId;
    }
    $.get("/api/reviews" + movieId, function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createReviewRow(data[i]));
      }
      renderReviewList(rowsToAdd);
      movieSelect.val("");
    });
  }

  // A function for rendering the list of reviews to the page
  function renderReviewList(rows) {
    reviewList.children().not(":last").remove();
    reviewContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      reviewList.prepend(rows);
    }

    else {
      console.log(rows);
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no reviews
  function renderEmpty() {
    reviewContainer.empty();

    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("There must be a Review created before you can view one.");
    reviewContainer.append(alertDiv);

    var query = window.location.search;
    var partial = "";
    if (movieSelect.val()) {
      partial = " for Movie Title" + movieSelect.val();
    }

    var message = $("<h2>");
    message.css({ "text-align": "center", "margin-top": "50px" });
    message.html("No reviews yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    reviewContainer.append(message);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("review");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/reviews/" + id
    }).then(getReviews);
  }

  // Function for handling what happens when the delete button is pressed
  function handleEditButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("review");
    var id = listItemData.id;
    // Edit the review via the cms form
    inputReview(id);
  }


});
