document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const registerMessage = document.getElementById("register-message");
  
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const username = document.getElementById("reg-username").value;
        const password = document.getElementById("reg-password").value;
  
        try {
            const response = await fetch("https://tic-tac-toe-three-azure.vercel.app/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
  
            const data = await response.json();
  
            if (response.ok) {
                alert("Registration successful! Redirecting to Login...");
                
                // ✅ Store username in localStorage
                localStorage.setItem("registeredUser", JSON.stringify({ username, password }));

                setTimeout(() => { window.location.href = "login.html"; }, 1500);
            } else {
                alert(data.message); // Show error message in popup
            }
        } catch (error) {
            alert("Server error. Try again.");
        }
    });
});