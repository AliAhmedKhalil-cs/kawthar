(function () {
  "use strict";

  if (!/checkout\.html/i.test(location.pathname)) return;

  const CART_KEYS = [
    "kawtharabdo_cart",
    "kaw_cart",
    "cart",
    "kawtharabdo_selection",
    "selection"
  ];

  const SHIPPING = 50;

  function money(value) {
    const n = Math.max(0, Math.round(Number(value || 0)));
    return `EGP ${n.toLocaleString("en-EG")}`;
  }

  function parsePrice(text) {
    const n = String(text || "").replace(/[^\d.]/g, "");
    return Number(n || 0);
  }

  function getName(item) {
    if (typeof item.name === "string") return item.name;
    if (item.name && typeof item.name.en === "string") return item.name.en;
    if (item.name && typeof item.name.ar === "string") return item.name.ar;
    if (item.title) return item.title;
    return "KAWTHAR product";
  }

  function getImage(item) {
    return item.image || item.img || item.thumbnail || item.photo || "./assets/logo/kawthar-logo-hd.webp?v=logo-1782681526";
  }

  function getCategory(item) {
    return item.category || item.type || "Stainless Steel Anti Rust";
  }

  function getQty(item) {
    return Math.max(1, Number(item.quantity || item.qty || item.count || 1));
  }

  function getPrice(item) {
    return Number(item.price || item.salePrice || item.finalPrice || item.unitPrice || 0);
  }

  function normalizeItem(item, index) {
    const qty = getQty(item);
    const price = getPrice(item);

    return {
      ...item,
      id: item.id || item.productId || item.slug || `kaw-${index}-${getName(item).replace(/\s+/g, "-").toLowerCase()}`,
      name: getName(item),
      category: getCategory(item),
      image: getImage(item),
      price,
      quantity: qty,
      qty
    };
  }

  function readCartFromStorage() {
    for (const key of CART_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;

        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length) {
          return {
            key,
            items: data.map(normalizeItem).filter((x) => getName(x))
          };
        }
      } catch {}
    }

    return { key: "kawtharabdo_cart", items: [] };
  }

  function saveCart(items, preferredKey) {
    const clean = items.map((item) => ({
      ...item,
      quantity: Math.max(1, Number(item.quantity || item.qty || 1)),
      qty: Math.max(1, Number(item.quantity || item.qty || 1))
    }));

    const keysToWrite = new Set([preferredKey || "kawtharabdo_cart"]);

    CART_KEYS.forEach((key) => {
      if (localStorage.getItem(key)) keysToWrite.add(key);
    });

    keysToWrite.forEach((key) => {
      try {
        localStorage.setItem(key, JSON.stringify(clean));
      } catch {}
    });

    window.dispatchEvent(new CustomEvent("kawtharabdo:cart-updated", { detail: clean }));
    window.dispatchEvent(new StorageEvent("storage", { key: preferredKey || "kawtharabdo_cart" }));
  }

  function findSelectionPanel() {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,strong,b,span,div"))
      .filter((el) => (el.textContent || "").trim().toLowerCase() === "your selection");

    for (const heading of headings) {
      let node = heading;
      for (let i = 0; i < 6 && node && node !== document.body; i++) {
        const text = (node.textContent || "").toLowerCase();
        if (text.includes("subtotal") || text.includes("shipping") || text.includes("total")) {
          return node;
        }
        node = node.parentElement;
      }
    }

    return document.querySelector("#coCartList")?.parentElement ||
           document.querySelector(".checkout-panel") ||
           document.querySelector("main");
  }

  function parseCartFromDOM() {
    const panel = findSelectionPanel();
    if (!panel) return [];

    const rows = Array.from(panel.querySelectorAll("div, article, li"))
      .filter((row) => {
        const text = (row.textContent || "").trim();
        return text.includes("EGP") && text.includes("Remove") && row.querySelector("img");
      })
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    const items = [];

    rows.forEach((row, index) => {
      const text = row.textContent || "";
      const img = row.querySelector("img");
      const priceMatch = text.match(/EGP\s*[\d,]+/i);
      const priceTotal = priceMatch ? parsePrice(priceMatch[0]) : 0;

      const qtyButtonsText = text.match(/[-−]\s*(\d+)\s*[+＋]/);
      const qty = qtyButtonsText ? Math.max(1, Number(qtyButtonsText[1])) : 1;
      const unit = qty > 0 && priceTotal > 0 ? priceTotal / qty : priceTotal;

      let name = "KAWTHAR product";
      const strong = row.querySelector("strong,b,h3,h4");
      if (strong && !/egp|remove/i.test(strong.textContent || "")) {
        name = strong.textContent.trim();
      } else {
        const lines = text.split("\n").map((x) => x.trim()).filter(Boolean);
        const candidate = lines.find((x) => !/egp|remove|stainless|anti|rust|^\d+$|^\+$|^-$/.test(x.toLowerCase()));
        if (candidate) name = candidate;
      }

      items.push({
        id: `dom-${index}-${name.replace(/\s+/g, "-").toLowerCase()}`,
        name,
        category: "Stainless Steel Anti Rust",
        image: img ? img.getAttribute("src") : "./assets/logo/kawthar-logo-hd.webp?v=logo-1782681526",
        price: unit,
        quantity: qty,
        qty
      });
    });

    return items;
  }

  function getCartState() {
    const stored = readCartFromStorage();

    if (stored.items.length) return stored;

    const domItems = parseCartFromDOM();
    if (domItems.length) {
      saveCart(domItems, stored.key);
      return { key: stored.key, items: domItems };
    }

    return stored;
  }

  function subtotal(items) {
    return items.reduce((sum, item) => {
      return sum + getPrice(item) * getQty(item);
    }, 0);
  }

  function updateExternalTotals(items) {
    const sub = subtotal(items);
    const shipping = sub > 0 ? SHIPPING : 0;
    const total = sub + shipping;

    const textTotal = money(total);

    [
      "manualGatewayTotal",
      "kawGatewayTotal",
      "kawSimpleTotal",
      "ipaAmount",
      "coTotal",
      "checkoutTotal"
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = textTotal;
    });

    document.querySelectorAll("[data-cart-count], .cart-count, .selection-count").forEach((el) => {
      el.textContent = String(items.reduce((s, item) => s + getQty(item), 0));
    });
  }

  function render() {
    const state = getCartState();
    const items = state.items;
    const panel = findSelectionPanel();

    if (!panel) return;

    panel.classList.add("kaw-checkout-cart-fixed");

    const sub = subtotal(items);
    const shipping = sub > 0 ? SHIPPING : 0;
    const total = sub + shipping;

    if (!items.length) {
      panel.innerHTML = `
        <div class="kaw-cart-empty-fixed">
          <strong>Your selection is empty</strong>
          <p>Go back to the shop and choose your favorite piece.</p>
          <a href="./shop.html">Back to shop</a>
        </div>
      `;
      updateExternalTotals(items);
      saveCart(items, state.key);
      return;
    }

    const rows = items.map((item, index) => {
      const qty = getQty(item);
      const unit = getPrice(item);
      const lineTotal = unit * qty;

      return `
        <article class="kaw-cart-item-fixed" data-index="${index}">
          <img src="${String(getImage(item)).replace(/"/g, "&quot;")}" alt="${String(getName(item)).replace(/"/g, "&quot;")}" loading="lazy">
          <div class="kaw-cart-info-fixed">
            <strong>${getName(item)}</strong>
            <span>${getCategory(item)}</span>
            <div class="kaw-cart-controls-fixed">
              <button type="button" data-cart-action="minus" aria-label="Decrease quantity">−</button>
              <b>${qty}</b>
              <button type="button" data-cart-action="plus" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="kaw-cart-price-fixed">
            <strong>${money(lineTotal)}</strong>
            <button type="button" class="kaw-cart-remove-fixed" data-cart-action="remove">Remove</button>
          </div>
        </article>
      `;
    }).join("");

    panel.innerHTML = `
      <div class="kaw-checkout-cart-fixed" id="kawCheckoutCartFixed">
        ${rows}

        <div class="kaw-cart-totals-fixed">
          <div class="kaw-total-line-fixed">
            <span>Subtotal</span>
            <strong>${money(sub)}</strong>
          </div>
          <div class="kaw-total-line-fixed">
            <span>Shipping</span>
            <strong>${money(shipping)}</strong>
          </div>
          <div class="kaw-total-line-fixed is-grand">
            <span>Total</span>
            <strong>${money(total)}</strong>
          </div>
        </div>
      </div>
    `;

    updateExternalTotals(items);
    saveCart(items, state.key);
  }

  function handleClick(event) {
    const btn = event.target.closest("[data-cart-action]");
    if (!btn) return;

    event.preventDefault();
    event.stopPropagation();

    const row = btn.closest("[data-index]");
    if (!row) return;

    const index = Number(row.getAttribute("data-index"));
    const action = btn.getAttribute("data-cart-action");

    const state = getCartState();
    const items = state.items;

    if (!items[index]) return;

    if (action === "plus") {
      items[index].quantity = getQty(items[index]) + 1;
      items[index].qty = items[index].quantity;
    }

    if (action === "minus") {
      const next = getQty(items[index]) - 1;
      if (next <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = next;
        items[index].qty = next;
      }
    }

    if (action === "remove") {
      items.splice(index, 1);
    }

    saveCart(items, state.key);
    render();
  }

  function bind() {
    document.addEventListener("click", handleClick, true);
  }

  function run() {
    bind();
    render();

    setTimeout(render, 500);
    setTimeout(render, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  console.info("KAWTHAR checkout cart controller loaded.");
})();
