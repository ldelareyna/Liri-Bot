// Require dotenv package to set environment variables to the global process.env object in node.
// These are values that are meant to be specific to the computer that node is running on,
// and since we are gitignoring this file, they won't be pushed to github.
require("dotenv").config();

// _______________________________________________________________________________________________
// Request Node packages: Twitter, Spotify, Request for movies (OMDB API), FS to read and append files, and the keys file for our keys.
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');
//var Twitter = require('twitter');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var logFile = "Data logged to log.txt file."

//_________________________________________________________________________________________________
// Variables to store our command line arguments
// Bonus:  In addition to logging the data to your terminal/bash window
// output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file.

var command = process.argv[2];
var input = process.argv[3];

if (command === "movie-this") {
    logData("liri-command = movie-this");
    getMovie(input);
} else if (command === "my-tweets") {
    getTweets(input);
} else if (command === "spotify-this-song") {
    logData("liri-command = spotify-this-song");
    getSong(input);
} else if (command === "concert-this") {
    logData("liri-command = concert-this");
    getConcert(input);
} else if (command === "do-what-it-says") {
    logData("liri-command = do-what-it-says");
    doWhatItSays();
} else {
    console.log("This Liri command you have entered does not exist.");
}

// Will run when the user says concert-this
function getConcert(input) {
    request("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp", function (error, response, body) {

        //If the request is successful
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            //console.log(body);}
            //console.log("Venue Name: " + body[0].venue.name);
            //console.log("Venue Location: " + body[0].venue.city + ", " + body[0].venue.region + ", " + body[0].venue.country);
            //console.log("Concert Date: " + body[0].datetime);

            var concertResults =
                    "________________________________________________" + "\r\n" +
                    //Output the artist
                    "Venue Name: " + body[0].venue.name + "\r\n" +
                    //Output the song's name.
                    "Venue Location: " + body[0].venue.city + ", " + body[0].venue.region + ", " + body[0].venue.country + "\r\n" +
                    //Output a preview link of the song from Spotify.
                    "Concert Date: " + body[0].datetime + "\r\n" +
                    "________________________________________________";
                //Display song info in the terminal.
                console.log(concertResults);

                logData(concertResults);
        }

    });
};

// Will run when the user says 
function getMovie(input) {
    request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            //console.log(body);

            //Log in the information to log.txt
            var movieResults =
                    "________________________________________________" + "\r\n" +
                    //Output the artist
                    "Movie Title: " + body.Title + "\r\n" +
                    //Output the song's name.
                    "Release Date: " + body.Year + "\r\n" +
                    //Output a preview link of the song from Spotify.
                    "IMDB Rating: " + body.imbdRating + "\r\n" +
                    //Output the album that the song is from.
                    "Rotten Tomatoes Rating: " + body.Ratings[1].Value + "\r\n" +
                    "Country: " + body.Country + "\r\n" +
                    "Language: " + body.Language + "\r\n" +
                    "Plot: " + body.Plot + "\r\n" +
                    "Actors: " + body.Actors + "\r\n" +
                    "________________________________________________";
                //Display song info in the terminal.
                console.log(movieResults);

                logData(movieResults);


        } else {
            return console.log(error)

        }


    });
};

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var songdataArray = data.split(",");
        getSong(songdataArray[1]);
        logData(songdataArray[1]);
    });
}

function getSong(input) {
    if (input) {
        var song = input
    } else {
        var song = "The Sign"
    }
    spotify.search({ type: 'track', query: song }, function (error, data) {
        if (error) {
            return console.log(error);
        }

        else {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var trackInfo = data.tracks.items[i];
                //Create variable for song preview link.
                var previewSong = trackInfo.preview_url;
                //If the song preview is not available, display the song preview is not available.
                if (previewSong === null) {
                    previewSong = "Song preview is not available for this song.";
                }
                //song results.
                var songResults =
                    "________________________________________________" + "\r\n" +
                    //Output the artist
                    "Artist: " + trackInfo.artists[0].name + "\r\n" +
                    //Output the song's name.
                    "Song title: " + trackInfo.name + "\r\n" +
                    //Output a preview link of the song from Spotify.
                    "Preview song: " + previewSong + "\r\n" +
                    //Output the album that the song is from.
                    "Album: " + trackInfo.album.name + "\r\n" +
                    "________________________________________________";
                //Display song info in the terminal.
                console.log(songResults);

                logData(songResults);
            }

        }

    });
};

function logData(logResults) {

    fs.appendFile("log.txt", logResults + "\r\n" , function(error) {
    if (error) {
        return console.log(error);
    }
    // If there is no error
    else {
        // Do nothing ----> //console.log("Data Logged");
    }
});

}