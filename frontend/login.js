document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginMessage = document.getElementById("login-message");

    // Automatically detect environment
    const API_BASE = window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://tic-tac-toe-advanced.onrender.com/login"; // 🔁 Replace this with your actual Render backend URL

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful! Redirecting...");
                localStorage.setItem("token", data.token);
                localStorage.setItem("loggedInUser", username);
                setTimeout(() => {
                    window.location.href = "settings.html";
                }, 1500);
            } else {
                alert(data.message); // Show error message
            }
        } catch (error) {
            alert("Server error. Try again.");
        }
    });
});
