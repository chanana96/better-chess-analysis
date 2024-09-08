const { 
  processNumbers
} = require("./utils");

/**
 * Removing annotations, comments, and spaces/newlines
 * @param {string} pgn 
 * @returns {string} clean moves
 */
function cleanMovesAnnotations(pgn) {
  // Remove metadata (everything in square brackets [])
  const movesOnly = pgn.replace(/\[.*?\]\s?/g, "");

  // Remove eval annotations and any comments inside curly braces { }
  const cleanedMoves = movesOnly.replace(
    /\{.*?(\[%eval.*?\]).*?\}|\{.*?\}/g,
    ""
  );

  // Remove any remaining spaces and newlines around moves
  const finalMoves = cleanedMoves.trim().replace(/\s+/g, " ");

  return finalMoves;
}


/**
 * Remove move metadata (numbers, dots, parantheses)
 * @param {string} chessNotation 
 * @returns {string} clean moves
 */
function cleanMovesMetadata(chessNotation) {
  // Remove comments within parentheses (including nested)
  let cleanedInput = chessNotation.replace(/\([^()]*\)/g, "");
  while (cleanedInput.includes("(")) {
    cleanedInput = cleanedInput.replace(/\((?:[^)(]+|\([^)(]*\))*\)/g, "");
  }

  // Remove move numbers, ellipses, and dots
  cleanedInput = cleanedInput.replace(/\d+\./g, ""); // Remove numbers and dots indicating moves
  cleanedInput = cleanedInput.replace(/\.{2,}/g, ""); // Remove ellipses

  // Split the string into moves and trim whitespace
  let moves = cleanedInput.split(/\s+/).filter((move) => move.trim() !== "");

  return moves;
}

/**
 * 
 * @param {string} moves 
 * @param {boolean} filterEven 
 * @returns {number[]}
 */
function cleanMovesQuestionnable(moves, filterEven) {
  // Initialize an empty array to hold the indices of moves with a '?' or '??'
  let questionableIndices = [];

  // Iterate through the array of moves
  for (let i = 0; i < moves.length; i++) {
    // Check if the current move contains '?' or '??'
    if (moves[i].includes("?") || moves[i].includes("?!")) {
      // Add the index of the move to the array
      questionableIndices.push(i);
    }
  }

  // Filter the indices based on the 'filterEven' parameter
  if (filterEven) {
    // Filter out even indices
    questionableIndices = questionableIndices.filter(
      (index) => index % 2 !== 0
    );
  } else {
    // Filter out odd indices
    questionableIndices = questionableIndices.filter(
      (index) => index % 2 === 0
    );
  }

  return questionableIndices;
}

/**
 * 
 * @param {string} pgn 
 * @param {number[]} turns 
 * @param {boolean} isBlack 
 * @returns {string} moves of each turn according to black/white
 */
function extractMovesByTurns(pgn, turns, isBlack = false) {
  // Split the PGN into moves, capturing each individual move
  const moves = pgn.split(/\s+(?=\d+\.)/);

  // Initialize an array to hold the results
  let results = [];

  if (isBlack) {
    // Iterate through each turn in the turns array
    turns.forEach((turn) => {
      // Collect all moves up to one turn less than the specified turn
      let movesUpToTurn = moves.slice(0, turn).join(" ");
      let subset = movesUpToTurn.replace(/(\d+\.\s\S+)\s\S+$/, "$1");

      // Add the subset to the results array
      results.push(subset);
    });
  } else {
    // Iterate through each turn in the turns array
    turns.forEach((turn) => {
      // Collect all moves up to one turn less than the specified turn
      let subset = moves.slice(0, turn - 1).join(" ");

      // Add the subset to the results array
      results.push(subset);
    });
  }
  return results;
}


const cleanMoves = (pgn, isBlack = false) => (cleanPgn) => {
  // Clean the PGN annotations
  const movesAnnotationCleaned = cleanMovesAnnotations(pgn);
  
  // Clean the metadata from moves
  const movesMetadataCleaned = cleanMovesMetadata(movesAnnotationCleaned);
  
  // Clean questionable moves based on whether it's black's turn or not
  const movesQuestionableCleaned = cleanMovesQuestionnable(movesMetadataCleaned, isBlack);
  
  // Process move numbers (fixed typo from proccessedNumbersMoves to processedNumbersMoves)
  const processedNumbersMoves = processNumbers(movesQuestionableCleaned);

  // Extract moves by turns, using the cleaned PGN and processed move numbers
  const extractedMovesByTurns = extractMovesByTurns(cleanPgn, processedNumbersMoves, isBlack);

  return extractedMovesByTurns;
}

module.exports = {
  cleanMoves
};

