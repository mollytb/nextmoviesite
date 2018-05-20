$(document).ready(function() {
    var searchInput = $("#searchInput");

    $(document).on("click", "#search", function(event){
        event.preventDefault(); 
        SearchMovies();
       
      });

      function handleMovieFormSubmit(event) {
        event.preventDefault();
        // Don't do anything if the name fields hasn't been filled out
        if (!nameInput.val().trim().trim()) {
          return;
        }
        // Calling the insertMovie function and passing in the value of the name input
        insertMovie({
          movie_title: searchInput
            .val()
            .trim()
        });
      }
    
    function createMovieRow(movieData) {
        var newTr = $("<tr>");
        newTr.data("movie", movieData);
        newTr.append("<td>" + movieData.movie_title + "</td>");
        newTr.append("<td>" + movieData.actor_1_name  + ", " + movieData.actor_2_name + ", " + movieData.actor_3_name  + ", " + "</td>");
        newTr.append("<td>" + movieData.director_name + "</td>");
        newTr.append("<td>" + movieData.movie_genres + "</td>");
        newTr.append("<td>" + movieData.imdb_score + "</td>");
        newTr.append("<td><a href='/review?movie_id=" + movieData.id + "'>Reviews</a></td>");
        newTr.append("<td><a href='https://www.justwatch.com/us/search?q=" + encodeURIComponent(movieData.movie_title) + "'>Just Watch</a></td>");
        
        if( movieData.Reviews !=null) 
          newTr.append("<td> " + movieData.Reviews.length + "</td>");
     
     
        return newTr;
      }
    function SearchMovies() {
  
        $.get("/api/movies/:id", function(data) {
          //searchInput.val.trim();
    
          var rowsToAdd = [];
          for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createMovieRow(data[i]));
          }
          createMovieRow();
          //renderMovieList(rowsToAdd);
          searchInput.val("");
        });
      }
        // A function for rendering the list of movies to the page
  function renderMovieList(rows) {
    movieList.children().not(":last").remove();
    movieContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      movieList.prepend(rows);
    }

    else {
      console.log(rows);
      //renderEmpty();
    }
  }
});