const axios = require('axios')
require('dotenv').config()

const username = "imdaybert";

const lichessToken = process.env.LICHESS_TOKEN
const retrieveLastPlayedGameEndpoint = `https://lichess.org/api/games/user/${username}`;

const getLichessDataWithEvals = async () => {
  try {
    const response = await axios.get(retrieveLastPlayedGameEndpoint, {
      headers: {
        'Authorization': `Bearer ${lichessToken}`,
        'Content-Type': 'application/x-ndjson'
      },
      params: {
        max: 1,
        pgnInJson: true,
        literate: true,
        evals: true

      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const getLichessDataSimple = async () => {
  try {
    const response = await axios.get(retrieveLastPlayedGameEndpoint, {
      headers: {
        'Authorization': `Bearer ${lichessToken}`,
        'Content-Type': 'application/x-chess-pgn'
      },
      params: {
        max: 1,
        pgnInJson: true,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

module.exports = { getLichessDataWithEvals, getLichessDataSimple }
