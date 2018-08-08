const spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

const ombd = {
  apikey: process.env.OMDB_API_KEY
};

const owm = {
  apikey: process.env.OWM_API_KEY
};

module.exports = { spotify, ombd, owm };
