(function() {
  require('dotenv').config();
  const Spotify = require('node-spotify-api');
  const request = require('request');
  const keys = require('./keys');
  const fs = require('fs');
  const spotify = new Spotify(keys.spotify);
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
        let dataToAppend = {
          Artist: song.artists[0].name,
          Song: song.name,
          'Preview Link': song.preview_url,
          Album: song.album.name
        };

        dataToAppend = JSON.stringify(dataToAppend);

        fs.appendFile('log.txt', dataToAppend, err => {
          if (err) throw err;
          console.log('The song data was appended to log.txt!');
        });
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
    request(ombdURL, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        body = JSON.parse(body);
        console.log('----------------------------');
        console.log('* Title: ' + body.Title);
        console.log(' ');
        console.log('* Release Year: ' + body.Year);
        console.log(' ');
        console.log('* IMDB Rating: ' + body.imdbRating);
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
        console.log(' ');
        let dataToAppend = {
          Title: body.Title,
          'Release Year': body.Year,
          'IMDB Rating': body.imdbRating,
          'Rotten Tomatoes Rating': body.tomatoRating,
          Country: body.Country,
          Language: body.Language,
          Plot: body.Plot,
          Actors: body.Actors
        };
        dataToAppend = JSON.stringify(dataToAppend);
        fs.appendFile('log.txt', dataToAppend, err => {
          if (err) throw err;
          console.log('The movie data was appended to log.txt!');
        });
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
        let dataToAppend = {
          City: city,
          'Weather description': body.weather[0].description,
          Temperature: Math.round(body.main.temp) + '°F'
        };
        dataToAppend = JSON.stringify(dataToAppend);
        fs.appendFile('log.txt', dataToAppend, err => {
          if (err) throw err;
          console.log('The weather data was appended to log.txt!');
        });
      } else {
        console.log('-------------------');
        console.log('Please enter correct city');
      }
    });
  }

  function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', (error, data) => {
      if (!error) {
        const dataArr = data.split(', ');
        switch (dataArr[0]) {
          case 'spotify-this-song':
            spotifySong(dataArr[1]);
            break;
          case 'movie-this':
            omdbMovie(dataArr[1]);
            break;
          case 'get-weather':
            getWeather(dataArr[1]);
            break;
        }
      } else {
        console.log('error: ', error);
      }
    });
  }

  processCommands();
})();
