require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var liri = {
    commands: {
        concert: 'concert-this',
        spotify: 'spotify-this-song',
        movie: 'movie-this',
        doWhatItSays: 'do-what-it-says'
    },

    nodeArgs: process.argv,

    input: process.argv[2],

    userSearch: "",

    search: function () {
        for (var i = 3; i < this.nodeArgs.length; i++) {

            if (i > 3 && i < this.nodeArgs.length) {
                this.userSearch = this.userSearch + "+" + this.nodeArgs[i];

            } else {
                this.userSearch += this.nodeArgs[i];
            }
        }
    },

    concertSearch: function () {
        var concertQuery = `https://rest.bandsintown.com/artists/${this.userSearch}/events?app_id=codingbootcamp`;
        axios.get(concertQuery).then(
            function (response) {
                for (i = 0; i < response.data.length; i++) {
                    console.log("````````````````````");
                    console.log(response.data[i].venue.name);
                    console.log(response.data[i].venue.city + ", " + response.data[i].venue.country);
                    console.log(moment(response.data[i].datetime).format('MMM Do YYYY'));
                }
            }).catch(function (err) {
            console.log(err);
        });
    },

    spotifySearch: function () {

        if (this.nodeArgs.length < 4) this.userSearch = "ace+of+base+the+sign";

        spotify.search({
                type: 'track',
                query: this.userSearch
            },
            function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                for (i = 0; i < data.tracks.items.length; i++) {

                    console.log("````````````````````");
                    console.log("Artist: " + data.tracks.items[i].album.artists[0].name);
                    console.log("Song Name: " + data.tracks.items[i].name);

                    if (data.tracks.items[i].preview_url !== null) {
                        console.log("Preview: " + data.tracks.items[i].preview_url);
                    } else {
                        console.log("Preview: unavailable")
                    };

                    console.log("Album: " + data.tracks.items[i].album.name);
                };
            });
    },

    movieSearch: function () {

        // Checks to see if user entered a movie, searches for a default movie if they didn't
        if (this.nodeArgs.length < 4) {
            this.userSearch = "mr+nobody";
        }

        var omdbQuery = `http://www.omdbapi.com/?t=${this.userSearch}&y=&plot=short&apikey=b4d60128`;
        axios.get(omdbQuery).then(function (response) {

            console.log("````````````````````");
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Released);
            console.log("IMDB Rating: " + response.data.imdbRating);

            //If statement that removes rotten tomatoes rating if there isn't one (ex: tv shows). 
            if (response.data.Ratings.length > 1) {
                console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
            }
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

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
        });

    },

    grabText: function () {

        fs.readFile("random.txt", "utf8", function (err, data) {

            if (err) {
                return console.log(err);
            };

            //Splits the data from random.txt
            var dataArr = data.split(",");
            var newCommand = dataArr[0];
            var newSearch = dataArr[1].split(" ");
            //Removes the do-what-it-says from nodeArgs and adds in the command from random.txt
            liri.nodeArgs.splice(2, 1, newCommand);
            //Adds newSearch to process.argv
            for (i = 0; i < newSearch.length; i++) {
                liri.nodeArgs.push(newSearch[i]);
            };

            liri.search();

            if (liri.nodeArgs[2] === liri.commands.movie) liri.movieSearch();
            else if (liri.nodeArgs[2] === liri.commands.spotify) liri.spotifySearch();
            else if (liri.nodeArgs[2] === liri.commands.concert) liri.concertSearch();
            else {
                console.log("```")
                console.log("Please enter one of the following commands on random.txt:");
                console.log("concert-this");
                console.log("spotify-this-song");
                console.log("movie-this");
                console.log("do-what-it-says");
            }
        });
    }
};

switch (liri.input) {

    //Bands in town api
    case liri.commands.concert:
        liri.search();
        liri.concertSearch();
        break

        //Spotify Api
    case liri.commands.spotify:
        liri.search();
        liri.spotifySearch();
        break

        //OMDB Api
    case liri.commands.movie:
        liri.search();
        liri.movieSearch();
        break

        //Pulls the info from random.txt 
    case liri.commands.doWhatItSays:
        liri.grabText();
        break

    default:
        console.log("Please enter one of the following commands:");
        console.log("concert-this");
        console.log("spotify-this-song");
        console.log("movie-this");
        console.log("do-what-it-says");
};