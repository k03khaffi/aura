// Вся логика в замкнутой области видимости
(function () {

  let productsData = []; // ← больше НЕ глобальная переменная

  // Загрузка JSON
  async function loadProducts() {
    try {
      const response = await fetch("products.json");
      productsData = await response.json();
      renderProducts(productsData);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  // Рендер товаров
  function renderProducts(list) {
    const container = document.getElementById("product-list");
    if (!container) return;

    container.innerHTML = "";

    list.forEach(product => {
      container.innerHTML += `
        <div class="product" data-id="${product.id}">
          <img src="${product.image}">
          <h3>${product.name}</h3>
          <p>${product.brand}</p>
          <p class="price">${product.price} €</p>
        </div>
      `;
    });

    // Навешиваем обработчики после рендера
    document.querySelectorAll(".product").forEach(card => {
      card.addEventListener("click", () => {
        openModal(Number(card.dataset.id));
      });
    });
  }

  // Фильтры
  function applyFilters() {
    const category = document.getElementById("categoryFilter")?.value || "";
    const min = parseInt(document.getElementById("minPrice")?.value) || 0;
    const max = parseInt(document.getElementById("maxPrice")?.value) || 9999;

    const filtered = productsData.filter(p =>
      (category === "" || p.category === category) &&
      p.price >= min &&
      p.price <= max
    );

    renderProducts(filtered);
  }

  // Модальное окно
  function openModal(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalName").innerText = product.name;
    document.getElementById("modalBrand").innerText = product.brand;
    document.getElementById("modalPrice").innerText = product.price + " €";

    const sizeSelect = document.getElementById("modalSize");
    const colorSelect = document.getElementById("modalColor");

    sizeSelect.innerHTML = product.sizes.map(s => `<option>${s}</option>`).join("");
    colorSelect.innerHTML = product.colors.map(c => `<option>${c}</option>`).join("");

    document.getElementById("modalCartBtn").onclick = () => {
      addToCart(product, sizeSelect.value, colorSelect.value);
    };

    document.getElementById("modalFavBtn").onclick = () => {
      addToFavorites(product);
    };

    document.getElementById("productModal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("productModal").style.display = "none";
  }

  // Корзина
  function addToCart(product, size, color) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
      ...product,
      size,
      color
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Добавлено в корзину");
    closeModal();
  }

  // Избранное
  function addToFavorites(product) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.find(f => f.id === product.id)) {
      favorites.push(product);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Добавлено в избранное");
  }

  // Делаем фильтр глобально доступным (если кнопка в HTML вызывает onclick)
  window.applyFilters = applyFilters;
  window.closeModal = closeModal;

  // Запуск
  document.addEventListener("DOMContentLoaded", loadProducts);

})();