const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    player1: { type: String, required: true },
    player2: { type: String, required: true },
    matchResult: { type: String, required: true },
    date: { type: Date, default: Date.now } // Store when the game was played
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
