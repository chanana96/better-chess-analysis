const axios = require("axios");
require("dotenv").config();

const lichessToken = process.env.LICHESS_TOKEN;
const lichessid = process.env.LICHESS_ID;

const retrieveLastPlayedGameEndpoint = `https://lichess.org/api/games/user/${lichessid}`;

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
            ratings: 2000, //ratings should be an array if multiple ratings
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
