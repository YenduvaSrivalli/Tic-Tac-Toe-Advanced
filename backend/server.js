const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // Added for serving static files
const User = require("./models/User");
const Game = require("./models/Game");
const { isAuthenticated } = require("./auth");

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;

// Register a new user
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful" });
});

// Function to update the user's win history
const updateUserWinHistory = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error("User not found");
            return;
        }
        user.winHistory.push(new Date());
        await user.save();
    } catch (error) {
        console.error("Error updating win history", error);
    }
};

// Update win history after a game win
app.post("/game-win", async (req, res) => {
    const { userId } = req.body;
    try {
        await updateUserWinHistory(userId);
        res.json({ message: "Win history updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch game history (Protected route)
app.get("/game-history", isAuthenticated, async (req, res) => {
    try {
        const games = await Game.find({ playerId: req.user.userId });
        res.json({ games });
    } catch (error) {
        res.status(500).json({ message: "Error fetching game history" });
    }
});

// Save game result to database
app.post("/save-game", async (req, res) => {
    const { player1, player2, matchResult } = req.body;
    try {
        const newGame = new Game({ player1, player2, matchResult });
        await newGame.save();
        res.json({ message: "Game result saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving game result", error });
    }
});

// Fetch all game results
app.get("/game-results", async (req, res) => {
    try {
        const games = await Game.find().sort({ date: -1 }); // Show latest games first
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: "Error fetching game results", error });
    }
});

// Serve the index.html file when visiting the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
