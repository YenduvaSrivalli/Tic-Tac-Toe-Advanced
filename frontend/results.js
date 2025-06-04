document.addEventListener("DOMContentLoaded", async () => {
    const historyBody = document.getElementById("history-body");
    const lastGameResultElement = document.getElementById("last-game-result");

    try {
        // Fetch game history from the backend
        const response = await fetch("http://localhost:3000/game-results");
        const gameHistory = await response.json();

        console.log("Fetched Game History:", gameHistory);

        if (gameHistory.length === 0) {
            lastGameResultElement.textContent = "No games played yet.";
            return;
        }

        // Display last game result
        lastGameResultElement.textContent = gameHistory[0].matchResult || "No result available.";

        // Populate the game history table
        historyBody.innerHTML = "";
        gameHistory.forEach((game, index) => {
            const row = document.createElement("tr");

            const matchCell = document.createElement("td");
            matchCell.textContent = `Match ${index + 1}`;
            row.appendChild(matchCell);

            const playersCell = document.createElement("td");
            playersCell.textContent = `${game.player1} vs ${game.player2}`;
            row.appendChild(playersCell);

            const resultCell = document.createElement("td");
            resultCell.textContent = game.matchResult;
            row.appendChild(resultCell);

            historyBody.appendChild(row);
        });

        console.log("Game results displayed successfully!");

    } catch (error) {
        console.error("Error fetching game results:", error);
        lastGameResultElement.textContent = "Failed to load results.";
    }

    // ✅ Ensure buttons exist before adding event listeners
    setTimeout(() => {
        const playAgainButton = document.getElementById("play-again");
        const goHomeButton = document.getElementById("go-home");

        if (playAgainButton) {
            playAgainButton.addEventListener("click", () => {
                console.log("Redirecting to settings.html...");
                window.location.href = "settings.html";
            });
        } else {
            console.error("Play Again button not found!");
        }

        if (goHomeButton) {
            goHomeButton.addEventListener("click", () => {
                console.log("Redirecting to index.html...");
                window.location.href = "index.html";
            });
        } else {
            console.error("Go Home button not found!");
        }
    }, 500); // Delay to ensure DOM elements exist

});
