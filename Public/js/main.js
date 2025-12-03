// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Dark mode preference
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored === 'light') document.body.classList.remove('dark');
  if (stored === 'dark') document.body.classList.add('dark');

  // create a small toggle in navbar (if present)
  const toggle = document.querySelector('#themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
    });
  }

  // login/register forms (if present)
  const loginForm = document.querySelector('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('[name=email]').value;
      const password = loginForm.querySelector('[name=password]').value;
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Login successful! Welcome ' + data.user.name);
        window.location.href = '/';
      } else alert(data.error || 'Login failed');
    });
  }

  const regForm = document.querySelector('#registerForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = regForm.querySelector('[name=name]').value;
      const email = regForm.querySelector('[name=email]').value;
      const password = regForm.querySelector('[name=password]').value;
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, password })
      });
      if (res.status === 201) {
        alert('Registered! You can now login.');
        window.location.href = '/login.html';
      } else {
        const d = await res.json();
        alert(d.error || 'Registration failed');
      }
    });
  }

  // portfolio item click (simple modal)
  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.title').innerText;
      const desc = item.querySelector('.desc').innerText;
      alert(title + '\n\n' + desc);
    });
  });
});
