// ==============================
// PASSWORD TOGGLE FUNCTION
// ==============================
const togglePwd = document.getElementById('toggle-password');
const pwdInput = document.getElementById('password');
const eyeClosed = document.getElementById('eye-closed');
const eyeOpen = document.getElementById('eye-open');

togglePwd.addEventListener('click', () => {
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    eyeClosed.style.display = 'none';
    eyeOpen.style.display = 'inline';
  } else {
    pwdInput.type = 'password';
    eyeClosed.style.display = 'inline';
    eyeOpen.style.display = 'none';
  }
});

// ==============================
// ADMIN REGISTRATION USING LOCALSTORAGE
// ==============================
const regForm = document.getElementById('register-form');

regForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !contact || !email || !password) {
    return alert('Please fill all fields.');
  }

  let admins = JSON.parse(localStorage.getItem('pg_admins') || '[]');

  if (admins.find(a => a.email.toLowerCase() === email.toLowerCase())) {
    return alert('Email already registered.');
  }

  const admin = {
    id: 'a_' + Math.random().toString(36).slice(2, 9),
    name,
    contact,
    email,
    password
  };

  admins.push(admin);
  localStorage.setItem('pg_admins', JSON.stringify(admins));

  alert('Registration successful! You can now login.');
  window.location.href = 'login.html'; // ✅ redirect to login page
});
