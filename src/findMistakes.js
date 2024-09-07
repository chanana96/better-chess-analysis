// ODD NUMBER = WHITE, EVEN NUMBER = BLACK

const findmistakes = (Pgn, cleanPgn) => {
  let isBlack = false;

  const pgn = Pgn;
  const cleanpgn = cleanPgn;

  function extractMoves(pgn) {
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

  result = extractMoves(pgn);

  function extractMoves2(chessNotation) {
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

  function findQuestionableMoves(moves, filterEven) {
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
  // falselayer is white. false = player is black
  const a = extractMoves2(result);

  const b = findQuestionableMoves(a, isBlack);

  function processNumbers(numbers) {
    // Map each number in the array to a new number based on the described rules
    let processedNumbers = numbers.map((number) => {
      if (number % 2 === 0) {
        // If the number is even, divide by 2 and add 1
        return number / 2 + 1;
      } else {
        // If the number is odd, divide by 2 and add 0.5
        return number / 2 + 0.5;
      }
    });

    return processedNumbers;
  }

  const c = processNumbers(b);

  function extractMovesByTurns(pgn, turns) {
    // Split the PGN into moves, capturing each individual move
    const moves = pgn.split(/\s+(?=\d+\.)/);

    // Initialize an array to hold the results
    let results = [];

    // Iterate through each turn in the turns array
    turns.forEach((turn) => {
      // Collect all moves up to one turn less than the specified turn
      let subset = moves.slice(0, turn - 1).join(" ");

      // Add the subset to the results array
      results.push(subset);
    });

    return results;
  }

  function extractMovesByTurnsForBlack(pgn, turns) {
    // Split the PGN into moves, capturing each individual move
    const moves = pgn.split(/\s+(?=\d+\.)/);

    // Initialize an array to hold the results
    let results = [];

    // Iterate through each turn in the turns array
    turns.forEach((turn) => {
      // Collect all moves up to one turn less than the specified turn
      let movesUpToTurn = moves.slice(0, turn).join(" ");
      let subset = movesUpToTurn.replace(/(\d+\.\s\S+)\s\S+$/, "$1");

      // Add the subset to the results array
      results.push(subset);
    });

    return results;
  }

  if (isBlack) {
    return extractMovesByTurnsForBlack(cleanpgn, c);
  } else {
    return extractMovesByTurns(cleanpgn, c);
  }
};

module.exports = { findmistakes };
