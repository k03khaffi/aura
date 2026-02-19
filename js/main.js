// Загрузка каталога
function loadCatalog() {
    const container = document.getElementById("product-list");
    if (!container) return;
  
    container.innerHTML = "";
  
    products.forEach(product => {
      container.innerHTML += `
        <div class="product">
          <img src="${product.image}">
          <h3>${product.name}</h3>
          <p>${product.brand}</p>
          <p>${product.price} €</p>
          <select id="size-${product.id}">
            ${product.sizes.map(size => `<option>${size}</option>`).join("")}
          </select>
          <select id="color-${product.id}">
            ${product.colors.map(color => `<option>${color}</option>`).join("")}
          </select>
          <button onclick="addToCart(${product.id})">В корзину</button>
          <button onclick="addToFavorites(${product.id})">❤</button>
        </div>
      `;
    });
  }
  
  // Корзина
  function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = products.find(p => p.id === id);
    const size = document.getElementById(`size-${id}`).value;
    const color = document.getElementById(`color-${id}`).value;
  
    cart.push({ ...product, size, color });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Добавлено в корзину");
  }
  
  // Избранное
  function addToFavorites(id) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const product = products.find(p => p.id === id);
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Добавлено в избранное");
  }
  
  // Загрузка корзины
  function loadCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    container.innerHTML = "";
  
    let total = 0;
  
    cart.forEach((item, index) => {
      total += item.price;
  
      container.innerHTML += `
        <div>
          <h3>${item.name}</h3>
          <p>${item.price} € | ${item.size} | ${item.color}</p>
          <button onclick="removeFromCart(${index})">Удалить</button>
        </div>
      `;
    });
  
    document.getElementById("total").innerText = total + " €";
  }
  
  function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
  
  // Оформление заказа
  function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
  
    orders.push({
      id: Date.now(),
      items: cart,
      date: new Date().toLocaleString()
    });
  
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");
  
    alert("Заказ оформлен!");
    window.location.href = "account.html";
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadCatalog();
    loadCart();
  });