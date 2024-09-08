const axios = require("axios");
require("dotenv").config();

const lichessToken = process.env.LICHESS_TOKEN;
const lichessid = process.env.LICHESS_ID;
const gameId = `DHNZD0Yi`;

const retrieveLastPlayedGameEndpoint = `https://lichess.org/api/games/user/${lichessid}`;
const retrieveSpecificGameEndpoint = `https://lichess.org/game/export/${gameId}`;

const getLichessDataWithEvalsSpecificGame = async () => {
  try {
    const response = await axios.get(retrieveSpecificGameEndpoint, {
      headers: {
        Authorization: `Bearer ${lichessToken}`,
        Accept: "application/json",
      },
      params: {
        pgnInJson: true,
        clocks: false,
        literate: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getLichessDataSimpleSpecificGame = async () => {
  try {
    const response = await axios.get(retrieveSpecificGameEndpoint, {
      headers: {
        Authorization: `Bearer ${lichessToken}`,
        Accept: "application/json",
      },
      params: {
        pgnInJson: true,
        clocks: false,
        evals: false,
      },
    });
    return response.data.pgn;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getLichessDataWithEvals = async () => {
  try {
    const response = await axios.get(retrieveLastPlayedGameEndpoint, {
      headers: {
        Authorization: `Bearer ${lichessToken}`,
        Accept: "application/x-ndjson",
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
        Accept: "application/x-chess-pgn",
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
        Accept: "application/json",
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
            Accept: "application/json",
          },
          params: {
            fen: fen,
            ratings: [2000, 2200, 2500],
          },
        }
      );
      return {
        fen: fen,
        moves: newresponse.data.moves.map((move) => move.san),
        source: "lichess",
      };
    } else {
      return {
        fen: fen,
        moves: response.data.moves.map((move) => move.san),
        source: "masters",
      };
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
  getLichessDataSimpleSpecificGame,
  getLichessDataWithEvalsSpecificGame,
};
