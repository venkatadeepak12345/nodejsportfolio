// Run this after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------
    // THEME TOGGLE
    // -------------------------------

    const toggle = document.getElementById("themeToggle");

    // Load saved theme
    let saved = localStorage.getItem("theme") || "dark";
    document.body.classList.toggle("dark", saved === "dark");

    if (toggle) toggle.textContent = saved === "dark" ? "☀️" : "🌙";

    // Toggle theme on click
    if (toggle) {
        toggle.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            toggle.textContent = isDark ? "☀️" : "🌙";
        });
    }

    // -------------------------------
    // LOGIN FORM
    // -------------------------------
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Login successful! Welcome ' + data.user.name);
                window.location.href = '/';
            } else {
                alert(data.error || 'Login failed');
            }
        });
    }

    // -------------------------------
    // REGISTER FORM
    // -------------------------------
    const regForm = document.querySelector('#registerForm');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = regForm.name.value;
            const email = regForm.email.value;
            const password = regForm.password.value;

            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ name, email, password })
            });

            const d = await res.json();

            if (res.status === 201) {
                alert('Registered! You can now login.');
                window.location.href = '/login.html';
            } else {
                alert(d.error || 'Registration failed');
            }
        });
    }

    // -------------------------------
    // PORTFOLIO ITEM POPUP
    // -------------------------------
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.title').innerText;
            const desc = item.querySelector('.desc').innerText;
            alert(title + '\n\n' + desc);
        });
    });

});
