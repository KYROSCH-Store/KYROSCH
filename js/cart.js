(() => {
  const PHONE = "51965474751";
  const STORAGE_KEY = "kyrosch_cart";

  const $ = (s, p = document) => p.querySelector(s);

  const moneyToNumber = (txt) => {
    const n = (txt || "").replace(/[^\d.,]/g, "").replace(",", ".");
    return parseFloat(n) || 0;
  };

  const formatMoney = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

  const loadCart = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  };

  const saveCart = (cart) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

  const cartCount = (cart) => cart.reduce((a, it) => a + (it.qty || 0), 0);
  const cartTotal = (cart) => cart.reduce((a, it) => a + (it.price * it.qty), 0);

  function init() {
    const fab     = $(".cart-fab");
    const countEl = $(".cart-count");
    const overlay = $(".cart-overlay");
    const drawer  = $(".cart-drawer");
    const itemsEl = $(".cart-items");
    const totalEl = $(".cart-total-value");
    const btnClose= $(".cart-close");
    const btnClear= $(".cart-clear");
    const btnSend = $(".cart-send");

    // Si no existe el carrito en la página, salimos sin romper nada
    if (!fab || !countEl || !overlay || !drawer || !itemsEl || !totalEl) {
      console.warn("[CART] No encuentro elementos del carrito. Revisa que existan: .cart-fab, .cart-overlay, .cart-drawer, .cart-items");
      return;
    }

    const openCart = () => {
      overlay.hidden = false;
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("no-scroll");
      document.body.style.overflow = "hidden";
    };

    const closeCart = () => {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      overlay.hidden = true;
      document.documentElement.classList.remove("no-scroll");
      document.body.style.overflow = "";
    };

    const render = () => {
      const cart = loadCart();
      countEl.textContent = String(cartCount(cart));
      totalEl.textContent = formatMoney(cartTotal(cart));

      itemsEl.innerHTML = "";
      if (cart.length === 0) {
        itemsEl.innerHTML = `<p style="opacity:.75;margin:8px 2px;">Tu carrito está vacío 😅</p>`;
        return;
      }

      cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.dataset.id = item.id;

        row.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
            <div class="price">${formatMoney(item.price)}</div>

            <div class="cart-qty">
              <button type="button" class="qty-minus" aria-label="Restar">−</button>
              <span>${item.qty}</span>
              <button type="button" class="qty-plus" aria-label="Sumar">+</button>
            </div>
          </div>
          <button type="button" class="cart-remove" aria-label="Eliminar">🗑</button>
        `;
        itemsEl.appendChild(row);
      });
    };

    const addToCartFromCard = (card) => {
      // Fallbacks por si cambias clases luego
      const imgEl = card.querySelector("img");
      const nameEl = card.querySelector("h3, h4, .product-name");
      const priceEl = card.querySelector(".blusas-precio, .price, .product-price, p");

      const id = card.dataset.sku || (nameEl?.innerText || "").trim() || ("SKU-" + Date.now());
      const name = (nameEl?.innerText || "Producto").trim();
      const img = imgEl?.getAttribute("src") || imgEl?.src || "";
      const price = moneyToNumber(priceEl?.innerText || "");

      const cart = loadCart();
      const existing = cart.find(x => x.id === id);

      if (existing) existing.qty += 1;
      else cart.push({ id, name, img, price, qty: 1 });

      saveCart(cart);
      render();
    };

    // Clicks globales (sirve para TODAS tus páginas)
    document.addEventListener("click", (e) => {
      // ADD
      const addBtn = e.target.closest(".btn-add-cart");
      if (addBtn) {
        const card = addBtn.closest(".blusas-card") || addBtn.closest(".product-card") || addBtn.closest("[data-sku]");
        if (!card) {
          console.warn("[CART] No encuentro el card padre del botón .btn-add-cart");
          return;
        }
        addToCartFromCard(card);
        addBtn.textContent = "Agregado ✓";
        setTimeout(() => (addBtn.textContent = "Añadir al carrito"), 900);
        return;
      }

      // QTY / REMOVE
      const row = e.target.closest(".cart-item");
      if (!row) return;

      const id = row.dataset.id;
      if (!id) return;

      const cart = loadCart();
      const item = cart.find(x => x.id === id);
      if (!item) return;

      if (e.target.closest(".cart-remove")) {
        saveCart(cart.filter(x => x.id !== id));
        render();
        return;
      }

      if (e.target.closest(".qty-plus")) item.qty += 1;
      if (e.target.closest(".qty-minus")) item.qty = Math.max(1, item.qty - 1);

      saveCart(cart);
      render();
    });

    // Abrir/cerrar
    fab.addEventListener("click", () => { render(); openCart(); });
    overlay.addEventListener("click", closeCart);
    btnClose && btnClose.addEventListener("click", closeCart);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
    });

    // Vaciar
    btnClear && btnClear.addEventListener("click", () => {
      saveCart([]);
      render();
    });

    // Enviar WhatsApp
    btnSend && btnSend.addEventListener("click", () => {
      const cart = loadCart();
      if (cart.length === 0) return;

      const total = cartTotal(cart);
      const lines = cart.map((it, i) => `${i+1}) ${it.name} x${it.qty} — ${formatMoney(it.price * it.qty)}`).join("\n");

      const msg =
`Hola 👋, quiero hacer un pedido en KYROSCH:

${lines}

🧾 Total: ${formatMoney(total)}

Por favor confírmame:
✅ Tallas y colores disponibles
✅ Tiempo de entrega y forma de pago`;

      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
    });

    render();
    console.log("[CART] OK ✅ Carrito inicializado");
  }

  // Espera DOM listo (por si algún script carga antes)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();