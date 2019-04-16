require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);


//Variables for the programs 4 different commands
var concert = "concert-this";
var searchSpotify = "spotify-this-song";
var movie = "movie-this";
var doWhatItSays = "do-what-it-says";

var nodeArgs = process.argv;
var userSearch = "";

function search() {
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            userSearch = userSearch + "+" + nodeArgs[i];

        } else {
            userSearch += nodeArgs[i];
        }
    }
}

var input = process.argv[2];

switch (input) {

    //Bands in town api
    case concert:
        search();
        var concertQuery = `https://rest.bandsintown.com/artists/${userSearch}/events?app_id=codingbootcamp`;
        axios.get(concertQuery).then(
            function (response) {
                for (i = 0; i < response.data.length; i++) {
                    console.log("```")
                    console.log(response.data[i].venue.name);
                    console.log(response.data[i].venue.city + ", " + response.data[i].venue.country);
                    console.log(moment(response.data[i].datetime).format('MMM Do YYYY'));
                }
            }).catch(function (err) {
            console.log(err);
        });;

        break

        //Spotify Api
    case searchSpotify:
        search();

        spotify.search({
            type: 'track',
            query: userSearch
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            for (i = 0; i < data.tracks.items.length; i++) {

                console.log("```")
                console.log("Artist: " + data.tracks.items[i].album.artists[0].name);
                console.log("Song Name: " + data.tracks.items[i].name);

                if (data.tracks.items[i].preview_url !== null) {
                    console.log("Preview: " + data.tracks.items[i].preview_url);
                } else {
                    console.log("Preview: unavailable")
                }

                console.log("Album: " + data.tracks.items[i].album.name);
            }
        });

        break

        //OMDB Api
    case movie:

        //Runs if the user typed in a movie name
        if (process.argv.length < 4) {

            axios.get("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=b4d60128").then(function (response) {
                console.log("```");
                console.log("Title: " + response.data.Title);
                console.log("Release Year: " + response.data.Released);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("```");

            }).catch(function (err) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {

                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
            return
        }

        //Default if the user didn't search for a movie
        search();
        var omdbQuery = `http://www.omdbapi.com/?t=${userSearch}&y=&plot=short&apikey=b4d60128`;
        axios.get(omdbQuery).then(function (response) {

            console.log("```");
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Released);
            console.log("IMDB Rating: " + response.data.imdbRating);

            //If statement that removes rotten tomatoes rating if their isn't one (ex: tv shows).
            if (response.data.Ratings.length > 1) {
                console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
            }
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("```");

        }).catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {

                console.log(error.request);
            } else {

                console.log("Error", error.message);
            }
            console.log(error.config);
        })

        break

    case doWhatItSays:
        break

    default:
        break
}