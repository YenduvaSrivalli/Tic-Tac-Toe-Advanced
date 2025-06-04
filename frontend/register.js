document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const registerMessage = document.getElementById("register-message");

    // Automatically detect environment
    const API_BASE = window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://tic-tac-toe-advanced.onrender.com/register"; // 🔁 Replace with your actual Render backend URL

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("reg-username").value;
        const password = document.getElementById("reg-password").value;

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful! Redirecting to Login...");
                
                // ✅ Store username in localStorage
                localStorage.setItem("registeredUser", JSON.stringify({ username, password }));

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Server error. Try again.");
        }
    });
});
