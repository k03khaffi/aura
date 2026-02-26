function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`${tab}-form`).classList.add('active');
}

function register() {
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-password").value;
  const passConfirm = document.getElementById("reg-password-confirm").value;

  if (!email || !pass) {
    alert("Заполните все поля");
    return;
  }

  if (pass.length < 6) {
    alert("Пароль должен быть не короче 6 символов");
    return;
  }

  if (pass !== passConfirm) {
    alert("Пароли не совпадают");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.email === email)) {
    alert("Пользователь с таким email уже существует");
    return;
  }

  users.push({ email, password: pass });
  localStorage.setItem("users", JSON.stringify(users));
  
  alert("Регистрация успешна! Теперь можно войти.");
  switchTab('login');
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Неверный email или пароль");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify({ email }));
  alert("Вход выполнен успешно!");

  // Куда вернуть после входа
  const redirect = localStorage.getItem("loginRedirect") || "index.html";
  localStorage.removeItem("loginRedirect");
  window.location.href = redirect;
}