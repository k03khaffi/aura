function register() {
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    if (users.find(u => u.email === email)) {
      alert("Пользователь уже существует");
      return;
    }
  
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Регистрация успешна!");
    window.location.href = "login.html";
  }
  
  function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    const user = users.find(u => u.email === email && u.password === password);
  
    if (!user) {
      alert("Неверные данные");
      return;
    }
  
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "account.html";
  }
  
  function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  }