document.addEventListener("DOMContentLoaded", () => {
    const settings = JSON.parse(localStorage.getItem("ticTacToeSettings"));

    if (!settings || !settings.gridSize) {
        alert("No settings found! Redirecting to settings...");
        window.location.href = "settings.html";
        return;
    }

    const gridSize = settings?.gridSize ? parseInt(settings.gridSize) : 3; // Default 3x3
    const theme = settings.theme;
    const mode = settings.mode;
    const player1Name = settings.player1Name || "Player 1";
    const player2Name = settings.player2Name || (mode === "2" ? "Player 2" : "AI");

    const gameGrid = document.getElementById("game-grid");
    const currentPlayerDisplay = document.getElementById("current-player");
    const timerDisplay = document.createElement("div");
    const resetButton = document.getElementById("reset-button");

    // Append timer display
    document.getElementById("game-info-container").appendChild(timerDisplay);

    let currentPlayer = "X";
    let board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    let movesCount = 0;
    let timerInterval;
    const turnTimeLimit = 10;

    // Apply theme
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Set player names
    currentPlayerDisplay.textContent = player1Name;

    // Generate game board
    function generateGrid() {
        gameGrid.innerHTML = "";
        gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement("div");
                cell.classList.add("grid-cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener("click", () => handleCellClick(i, j, cell));
                gameGrid.appendChild(cell);
            }
        }
    }

    function handleCellClick(row, col, cell) {
        if (board[row][col] !== null) return;

        board[row][col] = currentPlayer;
        cell.textContent = currentPlayer;
        movesCount++;

        if (checkWin(row, col)) {
            const winnerName = currentPlayer === "X" ? player1Name : player2Name;
            alert(`${winnerName} wins!`);
            updateHistory(`${winnerName} won`);
            clearInterval(timerInterval);
            redirectToResults();
            return;
        }

        if (movesCount === gridSize * gridSize) {
            alert("It's a draw!");
            updateHistory("Draw");
            clearInterval(timerInterval);
            redirectToResults();
            return;
        }

        switchPlayer();

        if (mode === "1" && currentPlayer === "O") {
            setTimeout(makeAIMove, 1000); // Add delay to AI move
        }
    }

    function makeAIMove() {
        let bestMove = findBestMove();
        
        if (bestMove) {
            let cellIndex = bestMove.row * gridSize + bestMove.col;
            handleCellClick(bestMove.row, bestMove.col, gameGrid.children[cellIndex]);
        }
    }
    
    function findBestMove() {
        // 1️⃣ AI tries to win
        let winMove = getWinningMove("O");
        if (winMove) return winMove;
    
        // 2️⃣ AI blocks the player's winning move
        let blockMove = getWinningMove("X");
        if (blockMove) return blockMove;
    
        // 3️⃣ AI picks a strategic move
        return getBestAvailableMove();
    }
    
    function getWinningMove(player) {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (board[i][j] === null) { 
                    board[i][j] = player;  // Try the move
                    let isWinning = checkWinCondition(player);
                    board[i][j] = null;  // Undo the move
    
                    if (isWinning) {
                        return { row: i, col: j }; // Return the winning move
                    }
                }
            }
        }
        return null; // No winning move found
    }
    
    function checkWinCondition(player) {
        // Check rows and columns
        for (let i = 0; i < gridSize; i++) {
            if (board[i].every(cell => cell === player)) return true; // Row win
            if (board.map(row => row[i]).every(cell => cell === player)) return true; // Column win
        }
    
        // Check diagonals
        if (board.every((row, idx) => row[idx] === player)) return true; // Main diagonal win
        if (board.every((row, idx) => row[gridSize - 1 - idx] === player)) return true; // Anti-diagonal win
    
        return false;
    }
    
    function getBestAvailableMove() {
        let emptyCells = [];
        let corners = [];
        let center = null;
    
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (board[i][j] === null) {
                    emptyCells.push({ row: i, col: j });
    
                    // Center strategy
                    if (i === Math.floor(gridSize / 2) && j === Math.floor(gridSize / 2)) {
                        center = { row: i, col: j };
                    }
    
                    // Corner strategy (for 3x3)
                    if ((i === 0 || i === gridSize - 1) && (j === 0 || j === gridSize - 1)) {
                        corners.push({ row: i, col: j });
                    }
                }
            }
        }
    
        // Prioritize center, then corners, then random move
        if (center) return center;
        if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
        return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
    }
    

    function checkWin(row, col) {
        if (board[row].every((cell) => cell === currentPlayer)) return true;
        if (board.every((row) => row[col] === currentPlayer)) return true;
        if (row === col && board.every((_, i) => board[i][i] === currentPlayer)) return true;
        if (row + col === gridSize - 1 && board.every((_, i) => board[i][gridSize - 1 - i] === currentPlayer)) return true;

        return false;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentPlayerDisplay.textContent = currentPlayer === "X" ? player1Name : player2Name;
        resetTurnTimer();
    }

    function resetTurnTimer() {
        clearInterval(timerInterval);
        timerDisplay.textContent = `Time Left: ${turnTimeLimit} seconds`;
        startTurnTimer();
    }

    function startTurnTimer() {
        let timeLeft = turnTimeLimit;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft} seconds`;

            if (timeLeft <= 0) {
                alert(`${currentPlayer === "X" ? player1Name : player2Name}'s time is up! Turn skipped.`);
                switchPlayer();
            }
        }, 1000);
    }

    function updateScores() {
        const scores = JSON.parse(localStorage.getItem("scores")) || { player1Wins: 0, player2Wins: 0, draws: 0 };
        if (movesCount === gridSize * gridSize) {
            scores.draws++;
        } else if (currentPlayer === "X") {
            scores.player1Wins++;
        } else {
            scores.player2Wins++;
        }
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    function redirectToResults() {
        window.location.href = "results.html";
    }



    async function updateHistory(result) {
        const gameDetails = {
            player1: settings.player1Name,
            player2: settings.player2Name,
            matchResult: result
        };
    
        try {
            const response = await fetch("http://localhost:3000/save-game", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(gameDetails)
            });
    
            const data = await response.json();
            console.log("Game result saved:", data.message);
        } catch (error) {
            console.error("Error saving game result:", error);
        }
    }
    



    resetButton.addEventListener("click", () => {
        clearInterval(timerInterval);
        initializeGame();
    });

    function initializeGame() {
        currentPlayer = "X";
        board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
        movesCount = 0;
        generateGrid();
        resetTurnTimer();
    }

    initializeGame();
});
