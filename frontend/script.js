document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = localStorage.getItem("loggedInUser") || "Guest";
    document.getElementById("logged-in-user").textContent = loggedInUser;

    const modeSelector = document.getElementById("mode");
    const player2Container = document.getElementById("player2-container");

    modeSelector.value = "1"; // Default mode: 1 Player
    player2Container.style.display = "none";

    modeSelector.addEventListener("change", () => {
        player2Container.style.display = modeSelector.value === "2" ? "block" : "none";
    });

    const form = document.getElementById("settings-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const gridSize = document.getElementById("grid-size").value;
        const theme = document.getElementById("theme").value;
        const mode = document.getElementById("mode").value;
    
        // Get the name from the input field instead of defaulting to loggedInUser
        //const player1Input = document.getElementById("player1-name").value.trim();


        //const player1Name = player1Input || loggedInUser; // Use input if available, otherwise fallback to username
    
        //const player2Name = mode === "2" ? document.getElementById("player2-name").value.trim() || "Player 2" : "AI";
``
        const player1Input = document.getElementById("player1-name");
        const player2Input = document.getElementById("player2-name");
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();
        const nameRegex = /^[A-Za-z\s]{3,10}$/;

        if (!nameRegex.test(player1Name)) {
            alert("Player 1 name must be 3-10 letters and contain only alphabets.");
            player1Input.focus();
            return;
        }

        if (mode === "2" && !nameRegex.test(player2Name)) {
            alert("Player 2 name must be 3-15 letters and contain only alphabets.");
            player2Input.focus();
            return;
        }

    
        const settings = { gridSize, theme, mode, player1Name, player2Name: mode === "2" ? player2Name : "AI" };
        localStorage.setItem("ticTacToeSettings", JSON.stringify(settings));
    
        window.location.href = "game.html";
    });
    
});
