(function () {

  let productsData = []; 

  // Загрузка JSON — несколько вариантов пути, раскомментируй нужный
  async function loadProducts() {
    try {
      const response = await fetch("./products.json");

      if (!response.ok) {
        throw new Error(`HTTP ошибка! статус: ${response.status}`);
      }

      productsData = await response.json();
      console.log("Товары успешно загружены:", productsData.length, "шт.");

      renderProducts(productsData);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      // Показываем пользователю сообщение об ошибке (опционально)
      const container = document.getElementById("product-list");
      if (container) {
        container.innerHTML = `<p style="text-align:center; color:#c00; padding:40px;">
          Не удалось загрузить каталог товаров.<br>
          Проверьте консоль браузера (F12) для подробностей.
        </p>`;
      }
    }
  }

  // Рендер товаров
  function renderProducts(list) {
    const container = document.getElementById("product-list");
    if (!container) {
      console.warn("Контейнер #product-list не найден на странице");
      return;
    }

    container.innerHTML = "";

    if (list.length === 0) {
      container.innerHTML = `<p style="text-align:center; padding:40px; color:#777;">
        Нет товаров, соответствующих фильтру
      </p>`;
      return;
    }

    list.forEach(product => {
      container.innerHTML += `
        <div class="product" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <h3>${product.name}</h3>
          <p>${product.brand}</p>
          <p class="price">${product.price} ₽</p>
        </div>
      `;
    });

    document.querySelectorAll(".product").forEach(card => {
      card.addEventListener("click", () => {
        openModal(Number(card.dataset.id));
      });
    });
  }

  function applyFilters() {
    const category = document.getElementById("categoryFilter")?.value || "";
    const min = parseInt(document.getElementById("minPrice")?.value) || 0;
    const max = parseInt(document.getElementById("maxPrice")?.value) || 999999;

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
    if (!product) {
      console.warn("Товар с id", id, "не найден");
      return;
    }

    const modalImage   = document.getElementById("modalImage");
    const modalName    = document.getElementById("modalName");
    const modalBrand   = document.getElementById("modalBrand");
    const modalPrice   = document.getElementById("modalPrice");
    const modalSize    = document.getElementById("modalSize");
    const modalColor   = document.getElementById("modalColor");
    const modalCartBtn = document.getElementById("modalCartBtn");
    const modalFavBtn  = document.getElementById("modalFavBtn");

    if (modalImage)   modalImage.src = product.image;
    if (modalName)    modalName.innerText = product.name;
    if (modalBrand)   modalBrand.innerText = product.brand;
    if (modalPrice)   modalPrice.innerText = product.price + " ₽";

    if (modalSize && product.sizes) {
      modalSize.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join("");
    }

    if (modalColor && product.colors) {
      modalColor.innerHTML = product.colors.map(c => `<option value="${c}">${c}</option>`).join("");
    }

    if (modalCartBtn) {
      modalCartBtn.onclick = () => {
        addToCart(product, modalSize?.value || "—", modalColor?.value || "—");
      };
    }

    if (modalFavBtn) {
      modalFavBtn.onclick = () => addToFavorites(product);
    }

    const modal = document.getElementById("productModal");
    if (modal) modal.style.display = "block";
  }

  function closeModal() {
    const modal = document.getElementById("productModal");
    if (modal) modal.style.display = "none";
  }

  // Корзина
  function addToCart(product, size, color) {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      localStorage.setItem("loginRedirect", window.location.href);
      window.location.href = "auth.html";
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
      ...product,
      size,
      color,
      addedAt: new Date().toISOString(),
      userEmail: JSON.parse(currentUser).email
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Товар добавлен в корзину!");
    closeModal();
  }

  // Избранное
  function addToFavorites(product) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.some(f => f.id === product.id)) {
      favorites.push({ ...product });
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Добавлено в избранное");
    } else {
      alert("Товар уже в избранном");
    }
  }

  // Глобальные функции для onclick в HTML
  window.applyFilters = applyFilters;
  window.closeModal   = closeModal;

  // Старт
  document.addEventListener("DOMContentLoaded", loadProducts);

})();