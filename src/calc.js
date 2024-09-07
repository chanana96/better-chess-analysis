const { Chess } = require("chess.js");

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

module.exports = { getFen, extractMoves };
