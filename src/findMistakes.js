const { cleanMoves } = require("./utils/cleanMoves")


// ODD NUMBER = WHITE, EVEN NUMBER = BLACK
const findMistakes = (pgn, cleanPgn) => {
  // falselayer is white. false = player is black
  let isBlack = false;
  const cleanedMoves = cleanMoves(pgn, isBlack)
  const extractedMovesByTurns = cleanedMoves(cleanPgn);

  return extractedMovesByTurns;

};

module.exports = { findMistakes };
