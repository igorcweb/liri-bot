require('dotenv').config();
const Spotify = require('node-spotify-api');
require('dotenv').config();
const request = require('request');
const keys = require('./keys');
const spotify = new Spotify(keys.spotify);
const fs = require('fs');
const ombdApiKey = keys.ombd.apikey;
const owmApiKey = keys.owm.apikey;

function processCommands() {
  const command = process.argv[2];
  switch (command) {
    case 'spotify-this-song':
      spotifySong();
      break;
    case 'movie-this':
      omdbMovie();
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    case 'get-weather':
      getWeather();
      break;
    default:
      console.log('--------------------');
      console.log(
        'Please enter "spotify-this-song", "movie-this" or "get-weather" followed by your query, or "do-what-it-says" to get the command from the random.txt file'
      );
      console.log('--------------------');
  }
}

function spotifySong(song) {
  if (process.argv[3]) {
    song = '';
    process.argv.forEach((arg, index) => {
      if (index >= 3) {
        song += arg + ' ';
      }
    });
  } else if (!song) {
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
  } else if (!movie) {
    movie = 'Mr Nobody';
  }
  const ombdURL = `http://www.omdbapi.com/?t=${movie}&plot=short&tomatoes=true&apikey=${ombdApiKey}`;
  request(ombdURL, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
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

function getWeather(city) {
  if (process.argv[3]) {
    city = '';
    process.argv.forEach((arg, index) => {
      if (index >= 3) {
        city += arg + ' ';
      }
    });
  } else if (!city) {
    city = 'Dallas ';
  }
  city = city.slice(0, -1);
  const owmURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${owmApiKey}`;
  request(owmURL, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      console.log('----------------------');
      console.log('Here is the current weather in ' + city + ':');
      console.log(' ');
      console.log(body.weather[0].description);
      console.log(' ');
      console.log(Math.round(body.main.temp) + '°F');
      console.log(' ');
    } else {
      console.log('-------------------');
      console.log('Please enter correct city');
    }
  });
}

function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    if (!error) {
      const dataArr = data.split(', ');
      switch (dataArr[0]) {
        case 'spotify-this-song':
          spotifySong(dataArr[1]);
          break;
        case 'movie-this':
          omdbMovie(dataArr[1]);
          break;
      }
    } else {
      console.log('error: ', error);
    }
  });
}

processCommands();
