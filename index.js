const express = require("express");
const lichessapi = require("./src/lichessapi");
const calc = require("./src/calc");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/lichess", (req, res) => {
  lichessapi.getLichessDataWithEvals();
});


app.get("/lichesssimple", async (req, res) => {
  const mistakeFens = await calc.getMistakeFens();
  const result = await Promise.all(
    mistakeFens.map((fen) => lichessapi.checkOpeningExplorer(fen))
  )
}); // Process each FEN


app.get("/lichesssimple", async (req, res) => {
  const data = await lichessapi.getLichessDataSimple();

  const moves = await calc.extractMoves(data);
  const result = await calc.getFen(moves);


  console.log(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

