
$(document).ready(function () {
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
        SearchMovies(searchInput);
        

    });


});


function createMovieRow(movieData) {
    var newTr = $("<tr>");
    newTr.data("movie", movieData);
    newTr.append("<td>" + movieData.movie_title + "</td>");
    newTr.append("<td>" + movieData.actor_1_name + ", " + movieData.actor_2_name + ", " + movieData.actor_3_name + ", " + "</td>");
    newTr.append("<td>" + movieData.director_name + "</td>");
    newTr.append("<td>" + movieData.movie_genres + "</td>");
    newTr.append("<td>" + movieData.imdb_score + "</td>");
    newTr.append("<td><a href='/review?movie_id=" + movieData.id + "'>Reviews</a></td>");
    newTr.append("<td><a href='https://www.justwatch.com/us/search?q=" + encodeURIComponent(movieData.movie_title) + "'>Just Watch</a></td>");

    if (movieData.Reviews != null)
        newTr.append("<td> " + movieData.Reviews.length + "</td>");


    return newTr;
}

function SearchMovies(searchInput) {
    console.log(searchInput);

    $.get("/api/movies/" + searchInput, function (data, err, cb) {
        //searchInput.val.trim();
        console.log(data);
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createMovieRow(data[i]));
        }
       // createMovieRow(data);
        renderMovieList(rowsToAdd);
        //nameInput.val("");
    });
}

// A function for rendering the list of movies to the page
function renderMovieList(rows) {
    var movieList = $("tbody");
    var movieContainer = $(".movie-container");
    movieList.children().not(":last").remove();
    movieContainer.children(".alert").remove();
    if (rows.length) {
        console.log(rows);
        movieList.prepend(rows);
    } else {
        console.log(rows);
        //renderEmpty();
    }
};