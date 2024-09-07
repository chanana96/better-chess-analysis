const { Chess } = require("chess.js");
const { findmistakes } = require("./findMistakes");
const {
  getLichessDataWithEvals,
  getLichessDataSimple,
} = require("./lichessapi");

const checkPlayerColor = () => {};

const extractMoves = (pgn) => {
  // Remove lines that start with "[" and end with "]"
  const filtered = pgn.replace(/\[.*?\]\n/g, "").trim();

  return filtered;
};

const getFen = async (moves) => {
  const chess = new Chess();
  chess.loadPgn(moves);
  return chess.fen();
};

const getMistakeFens = async () => {
  const pgn = await getLichessDataWithEvals();
  const cleanpgn = extractMoves(await getLichessDataSimple());

  const mistakes = findmistakes(pgn, cleanpgn);
  const mistakeFens = await Promise.all(
    mistakes.map(async (move) => await getFen(move))
  );

  return mistakeFens;
};

module.exports = { getFen, extractMoves, getMistakeFens };
