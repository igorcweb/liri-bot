require('dotenv').config();
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
require('dotenv').config();
const request = require('request');
const keys = require('./keys');
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

const command = process.argv[2];

switch (command) {
  case 'spotify-this-song':
    spotifySong();
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

  console.log(song);
  spotify
    .search({ type: 'track', query: song })
    .then(res => {
      let song = res.tracks.items[0];
      console.log('Artist: ', song.artists[0].name);
      console.log('Song: ', song.name);
      console.log('Preview Link: ', song.preview_url);
      console.log('Album: ', song.album.name);
    })
    .catch(err => {
      console.log(err);
    });
}
