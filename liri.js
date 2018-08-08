require('dotenv').config();
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
require('dotenv').config();
const request = require('request');
const keys = require('./keys');
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
//OMBD API KEY
const apikey = keys.ombd.apikey;

const command = process.argv[2];

switch (command) {
  case 'spotify-this-song':
    spotifySong();
    break;
  case 'movie-this':
    omdbMovie();
    break;
  default:
    console.log('--------------------');
    console.log(
      'Please enter spotify-this-song, movie-this or do-what-it-says followed by your query.'
    );
    console.log('--------------------');
}

function spotifySong(song) {
  if (process.argv[3]) {
    song = '';
    process.argv.forEach((arg, index) => {
      if (index >= 3) {
        song += arg + ' ';
      }
    });
  } else {
    song = 'The Sign Ace of Base';
  }

  spotify
    .search({ type: 'track', query: song })
    .then(res => {
      let song = res.tracks.items[0];
      console.log('----------------------------');
      console.log('* Artist: ', song.artists[0].name);
      console.log(' ');
      console.log('* Song: ', song.name);
      console.log(' ');
      console.log('* Preview Link: ', song.preview_url);
      console.log(' ');
      console.log('* Album: ', song.album.name);
      console.log('----------------------------');
    })
    .catch(err => {
      console.log(err);
    });
}

function omdbMovie(movie) {
  if (process.argv[3]) {
    movie = '';
    process.argv.forEach((arg, index) => {
      if (index >= 3) {
        movie += arg + ' ';
      }
    });
  } else {
    movie = 'Mr Nobody';
  }
  const ombdURL = `http://www.omdbapi.com/?t=${movie}&plot=short&tomatoes=true&apikey=${apikey}`;
  request(ombdURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var body = JSON.parse(body);
      console.log('----------------------------');
      console.log('* Title: ' + body.Title);
      console.log(' ');
      console.log('* Release Year: ' + body.Year);
      console.log(' ');
      console.log('* IMdB Rating: ' + body.imdbRating);
      console.log(' ');
      console.log('* Rotten Tomatoes Rating: ' + body.tomatoRating);
      console.log(' ');
      console.log('* Country: ' + body.Country);
      console.log(' ');
      console.log('* Language: ' + body.Language);
      console.log(' ');
      console.log('* Plot: ' + body.Plot);
      console.log(' ');
      console.log('* Actors: ' + body.Actors);
      console.log('----------------------------');
    } else {
      console.log('error: ', error);
    }
  });
}
