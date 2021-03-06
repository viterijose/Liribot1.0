require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var URL = "";


var selection = process.argv[2];
var input = process.argv.splice(3).join(" ");
var info = " ";


switch (selection) {
    case "movie-this":

        if (!input) {
            input = "Mr Nobody";
            URL = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

            // console.log(URL);
            OMDB(URL);

        } else {

            URL = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
            OMDB(URL);
        }
        function OMDB(url) {
            request(url,
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {

                        console.log("The movie’s title: " + JSON.parse(body).Title);
                        console.log("The movie’s year: " + JSON.parse(body).Year);
                        console.log("The movie’s IMDB rating is: " + JSON.parse(body).imdbRating);
                        console.log("The movie’s RottenTomatoes rating is: " + JSON.parse(body).Ratings[1].value);
                        console.log("The movie's language: " + JSON.parse(body).Language);
                        console.log("The movie’s plot is: " + JSON.parse(body).Plot);
                        console.log("The movie’s actors are: " + JSON.parse(body).Actors);
                        info = (JSON.parse(body).Title + ":" + "\n" + "The movie’s year: " + JSON.parse(body).Year + "\n" + "The movie’s IMDB rating is: " + JSON.parse(body).imdbRating + "\n" + "The movie’s RottenTomatoes rating is: " + JSON.parse(body).Ratings[1].value + "\n" + "The movie's language: " + JSON.parse(body).Language + "\n" + "The movie’s plot is: " + JSON.parse(body).Plot + "\n" + "The movie’s actors are: " + JSON.parse(body).Actors);
                        log(info);
                    }
                });
        }
        break;

    case "spotify-this-song":
        if (!input) {
            input = "The Sign"
            Spotify_Search(input);
        } else {
            Spotify_Search(input);
        }

        function Spotify_Search(song) {
            spotify.search({ type: 'track', query: song }, function (err, data) {
                console.log(data.tracks.items[1].album.name);
                console.log(data.tracks.items[1].artists[0].name);
                console.log(data.tracks.items[1].external_urls.spotify);
                console.log(data.tracks.items[1].name);
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

            });
        }
        break;
    case "my-tweets":
        client.get('statuses/user_timeline', function (error, tweets, response) {
            for (var i = 0; i < 20; i++) {
                console.log("Tweet #" + (20 - i) + " " + tweets[i].text);
            }
            if (error) {
                return console.log('Error occurred: ' + error);
            }

        });
        break;
    case "do-what-it-says":
        fs.readFile("Random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            }
            var option = data.split(" ");
            var command = option[0];
            input = option.splice(1).join(" ");
            if (command == "spotify-this-song") {
                Spotify_Search(input);
            }
        });
        break;
    default:

}

function log(information) {
    fs.appendFile("Log.txt", information + "\n", function (err, data) {
        if (err) {
            return console.log(err);
        }
    });
}