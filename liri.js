require("dotenv").config();
var keys = require("./keys.js");

var liri = "liri";
var secondInput = process.argv[3];
var search = process.argv[4];

var spotify = new Spotify(keys.spotify);

var concert = "concert-this";

var searchSpotify = "spotify-this-song";

var movie = "movie-this";

var doWhatItSays = "do-what-it-says";