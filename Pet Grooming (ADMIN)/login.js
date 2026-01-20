const $ = (s) => document.querySelector(s);

// --- Helpers ---
function getAdmins() {
  return JSON.parse(localStorage.getItem('pg_admins') || '[]');
}

function saveAdmins(admins) {
  localStorage.setItem('pg_admins', JSON.stringify(admins));
}

// --- Ensure Default Admin Exists ---
(function ensureDefaultAdmin() {
  let admins = getAdmins();
  const defaultAdmin = {
    id: 'a_001',
    name: 'Super Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'Admin'
  };

  const exists = admins.some(a => a.email.toLowerCase() === defaultAdmin.email.toLowerCase());
  if (!exists) {
    admins.push(defaultAdmin);
    saveAdmins(admins);
    console.log('✅ Default admin account added:', defaultAdmin.email);
  }
})();

// --- Login Logic ---
function loginAdmin(email, password) {
  const admins = getAdmins();
  const found = admins.find(
    a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );

  if (!found) return { ok: false, msg: 'Invalid admin credentials.' };

  localStorage.setItem('pg_current_admin', JSON.stringify({
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role
  }));

  return { ok: true, admin: found };
}

// --- DOM Loaded ---
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = $('#admin-login-form');

  // ✅ Redirect if already logged in
  if (localStorage.getItem('pg_current_admin')) {
    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
      return;
    }
  }

  // ✅ Login form logic
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#admin-email').value.trim();
      const pass = $('#admin-password').value.trim();

      if (!email || !pass) return alert('Please fill in all fields.');

      const r = loginAdmin(email, pass);
      if (!r.ok) return alert(r.msg);

      alert(`Welcome, ${r.admin.name}!`);
      window.location.href = 'index.html';
    });

    // --- Password Toggle ---
    const togglePwd = $('#toggle-admin-password');
    const pwdInput = $('#admin-password');
    if (togglePwd && pwdInput) {
      togglePwd.addEventListener('click', () => {
        const isHidden = pwdInput.type === 'password';
        pwdInput.type = isHidden ? 'text' : 'password';
        togglePwd.innerHTML = isHidden
          ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.477 10.477A3 3 0 0114.12 14.12M6.742 6.742C4.892 8.295 3.74 10.09 3.458 12c1.274 4.057 5.064 7 10.542 7 1.174 0 2.302-.145 3.37-.417M9.88 9.88l4.24 4.24" />
            </svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" width="22" height="22">
              <path stroke-linecap="round" stroke-linejoin="round" d="M1.458 12C2.732 7.943 6.523 5 12 5c5.478 0 9.268 2.943 10.542 7-1.274 4.057-5.064 7-10.542 7-5.477 0-9.268-2.943-10.542-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>`;
      });
    }
  }

  // ✅ Protect index.html
  if (window.location.pathname.includes('index.html')) {
    const currentAdmin = JSON.parse(localStorage.getItem('pg_current_admin') || 'null');
    if (!currentAdmin) {
      alert('Please log in first!');
      window.location.href = 'login.html';
    }
  }
});

// --- Logout Function ---
function logout() {
  localStorage.removeItem('pg_current_admin');
  alert('Logged out successfully!');
  window.location.href = 'login.html';
}
