const { Chess } = require("chess.js");
require("dotenv").config();
const { findmistakes } = require("./findMistakes");
const {
  getLichessDataWithEvals,
  getLichessDataSimple,
  getLichessDataWithEvalsSpecificGame,
  getLichessDataSimpleSpecificGame,
} = require("./lichessapi");

const lichessid = process.env.LICHESS_ID;

const extractMovesFromSimplePgn = (pgn) => {
  //extract moves from pgn without evals (eg. 1. d4 e5 etc)
  // Remove lines that start with "[" and end with "]"
  const filtered = pgn.replace(/\[.*?\]\n/g, "").trim();

  return filtered;
};

const getFen = async (moves) => {
  const chess = new Chess();
  chess.loadPgn(moves);
  const fen = chess.fen();
  return fen;
};

const getMistakeFens = async () => {
  const pgn = await getLichessDataWithEvals();
  const cleanpgn = extractMovesFromSimplePgn(await getLichessDataSimple());
  const mistakes = findmistakes(
    pgn.pgn,
    cleanpgn,
    pgn.players.black.user.id === lichessid
  );
  const mistakeFens = await Promise.all(
    mistakes.map(async (move) => await getFen(move))
  );

  return mistakeFens;
};

const getMistakeFensSpecificGame = async () => {
  const pgn = await getLichessDataWithEvalsSpecificGame();
  const cleanpgn = extractMovesFromSimplePgn(
    await getLichessDataSimpleSpecificGame()
  );

  const mistakes = findmistakes(
    pgn.pgn,
    cleanpgn,
    pgn.players.black.user.id === lichessid
  );
  const mistakeFens = await Promise.all(
    mistakes.map(async (move) => await getFen(move))
  );

  return mistakeFens;
};

module.exports = {
  getFen,
  extractMovesFromSimplePgn,
  getMistakeFens,
  getMistakeFensSpecificGame,
};
