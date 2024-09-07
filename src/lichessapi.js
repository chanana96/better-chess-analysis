const axios = require("axios");
require("dotenv").config();


const gameId = `AlHNoqjp`;
const retrieveSpecificGame = `https://lichess.org/game/export/${gameId}`;

const username = process.env.USERNAME
const lichessToken = process.env.LICHESS_TOKEN;
const retrieveLastPlayedGameEndpoint = `https://lichess.org/api/games/user/${username}`;


const getLichessDataWithEvals = async () => {
  try {
    const response = await axios.get(retrieveLastPlayedGameEndpoint, {
      headers: {
        Authorization: `Bearer ${lichessToken}`,
        "Content-Type": "application/x-ndjson",
      },
      params: {
        max: 1,
        pgnInJson: true,
        literate: true,
        evals: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getLichessDataSimple = async () => {
  try {
    const response = await axios.get(retrieveLastPlayedGameEndpoint, {
      headers: {
        Authorization: `Bearer ${lichessToken}`,
        "Content-Type": "application/x-chess-pgn",
      },
      params: {
        max: 1,
        pgnInJson: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


const checkOpeningExplorer = async (fen) => {
  try {
    const response = await axios.get("https://explorer.lichess.ovh/masters", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        fen: fen,
      },
    });

    if (response.data.moves.length === 0) {
      const newresponse = await axios.get(
        "https://explorer.lichess.ovh/lichess",
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            fen: fen,
            ratings: 2000, // Corrected: ratings should be an array
          },
        }
      );

      return fen, newresponse.data.moves;
    } else {
      return fen, response.data.moves;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

module.exports = {
  getLichessDataWithEvals,
  getLichessDataSimple,
  checkOpeningExplorer,
};


module.exports = { getLichessDataWithEvals, getLichessDataSimple };
