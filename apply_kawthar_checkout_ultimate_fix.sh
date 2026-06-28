#!/usr/bin/env bash
set -e

echo "=== KAWTHAR CHECKOUT ULTIMATE FIX ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-checkout-ultimate-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

echo "Backup created: backups/backup-before-checkout-ultimate-$STAMP.tar.gz"

cat > js/kawthar-cart-core.js <<'JS'
(function () {
  "use strict";

  const CART_KEYS = [
    "kawthar_cart",
    "kaw_cart",
    "cart",
    "kawthar_selection",
    "selection"
  ];

  let lock = false;

  function parse(value) {
    try {
      const data = JSON.parse(value || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function cleanText(value, fallback) {
    return String(value || fallback || "").trim();
  }

  function nameOf(item) {
    if (typeof item.name === "string") return cleanText(item.name, "KAWTHAR product");
    if (item.name && typeof item.name.en === "string") return cleanText(item.name.en, "KAWTHAR product");
    if (item.name && typeof item.name.ar === "string") return cleanText(item.name.ar, "KAWTHAR product");
    if (item.title) return cleanText(item.title, "KAWTHAR product");
    return "KAWTHAR product";
  }

  function categoryOf(item) {
    return cleanText(item.category || item.type || item.collection || "Stainless Steel Anti Rust", "Stainless Steel Anti Rust");
  }

  function imageOf(item) {
    return cleanText(
      item.image || item.img || item.thumbnail || item.photo || item.src || "./assets/logo/kawthar-logo-hd.webp",
      "./assets/logo/kawthar-logo-hd.webp"
    );
  }

  function priceOf(item) {
    const value = Number(item.price || item.salePrice || item.finalPrice || item.unitPrice || 0);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  function qtyOf(item) {
    const value = Number(item.quantity || item.qty || item.count || 1);
    return Number.isFinite(value) ? Math.max(1, Math.round(value)) : 1;
  }

  function slug(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function mergeKey(item) {
    const name = slug(nameOf(item));
    const price = priceOf(item);

    /*
      Important:
      We merge by name + price.
      This fixes the current bug where the same product enters storage
      with different ids/categories and appears as separate rows.
    */
    return `${name}|${price}`;
  }

  function normalize(item, index) {
    const name = nameOf(item);
    const price = priceOf(item);
    const quantity = qtyOf(item);

    return {
      ...item,
      id: item.id || item.productId || item.slug || mergeKey(item) || `kaw-item-${index}`,
      productId: item.productId || item.id || item.slug || mergeKey(item),
      name,
      title: item.title || name,
      category: categoryOf(item),
      image: imageOf(item),
      img: item.img || imageOf(item),
      price,
      quantity,
      qty: quantity
    };
  }

  function betterCategory(a, b) {
    const weak = ["set", "category", "product", ""];
    const aa = String(a || "").trim();
    const bb = String(b || "").trim();

    if (weak.includes(aa.toLowerCase()) && bb) return bb;
    return aa || bb || "Stainless Steel Anti Rust";
  }

  function merge(items) {
    const map = new Map();

    items.map(normalize).forEach((item) => {
      const key = mergeKey(item);

      if (!map.has(key)) {
        map.set(key, item);
        return;
      }

      const old = map.get(key);
      const quantity = qtyOf(old) + qtyOf(item);

      map.set(key, {
        ...old,
        ...item,
        id: old.id || item.id,
        productId: old.productId || item.productId,
        name: nameOf(old) || nameOf(item),
        title: old.title || item.title || nameOf(item),
        category: betterCategory(old.category, item.category),
        image: imageOf(old).includes("logo") ? imageOf(item) : imageOf(old),
        img: imageOf(old).includes("logo") ? imageOf(item) : imageOf(old),
        price: priceOf(old) || priceOf(item),
        quantity,
        qty: quantity
      });
    });

    return Array.from(map.values()).filter((item) => nameOf(item) && priceOf(item) >= 0);
  }

  function readAll() {
    const all = [];

    CART_KEYS.forEach((key) => {
      const items = parse(localStorage.getItem(key));
      all.push(...items);
    });

    return merge(all);
  }

  function writeAll(items) {
    const clean = merge(items);

    lock = true;
    CART_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, JSON.stringify(clean));
      } catch {}
    });
    lock = false;

    updateBadges(clean);
    window.dispatchEvent(new CustomEvent("kawthar:cart-updated", { detail: clean }));
    return clean;
  }

  function updateBadges(items) {
    const count = merge(items).reduce((sum, item) => sum + qtyOf(item), 0);

    document.querySelectorAll(
      "[data-cart-count], .cart-count, .selection-count, #cartCount, #cartCounter"
    ).forEach((el) => {
      el.textContent = String(count);
    });
  }

  function syncFromStorage() {
    const items = readAll();
    writeAll(items);
    return items;
  }

  const originalSetItem = Storage.prototype.setItem;

  Storage.prototype.setItem = function (key, value) {
    if (lock || !CART_KEYS.includes(key)) {
      return originalSetItem.call(this, key, value);
    }

    try {
      const data = JSON.parse(value || "[]");
      if (Array.isArray(data)) {
        const clean = merge(data);
        originalSetItem.call(this, key, JSON.stringify(clean));
        setTimeout(syncFromStorage, 80);
        return;
      }
    } catch {}

    return originalSetItem.call(this, key, value);
  };

  window.KawtharCart = {
    keys: CART_KEYS,
    read: readAll,
    write: writeAll,
    merge,
    normalize,
    qtyOf,
    priceOf,
    nameOf,
    imageOf,
    categoryOf,
    sync: syncFromStorage
  };

  function boot() {
    syncFromStorage();

    document.addEventListener("click", () => {
      setTimeout(syncFromStorage, 180);
      setTimeout(syncFromStorage, 650);
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  console.info("KAWTHAR Cart Core loaded.");
})();
JS

cat > css/kawthar-checkout-ultimate.css <<'CSS'
/* =========================================================
   KAWTHAR CHECKOUT ULTIMATE
   Full isolated checkout UI. Fixes cart quantities, remove,
   duplicate products, totals, and payment panel.
   ========================================================= */

:root {
  --kaw-espresso: #2d2119;
  --kaw-brown: #4b3829;
  --kaw-muted: #7a624e;
  --kaw-gold: #c9a05c;
  --kaw-ivory: #fffaf6;
  --kaw-cream: #f5ede4;
  --kaw-stroke: rgba(93, 67, 45, 0.12);
  --kaw-shadow: 0 22px 60px rgba(45, 33, 25, 0.10);
}

body.kaw-checkout-ultimate-ready {
  background:
    radial-gradient(circle at 12% 8%, rgba(201,160,92,0.10), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(255,250,246,0.72), transparent 28%),
    linear-gradient(180deg, #f7efe7 0%, #efe4d8 100%) !important;
  overflow-x: hidden !important;
}

/* Hide broken legacy checkout content only on checkout page */
body.kaw-checkout-ultimate-ready main,
body.kaw-checkout-ultimate-ready .checkout-page,
body.kaw-checkout-ultimate-ready .checkout-shell,
body.kaw-checkout-ultimate-ready .checkout-grid,
body.kaw-checkout-ultimate-ready .checkout-panel,
body.kaw-checkout-ultimate-ready #coCartList,
body.kaw-checkout-ultimate-ready #payPanel,
body.kaw-checkout-ultimate-ready #kawPaymentPanel,
body.kaw-checkout-ultimate-ready #manualPaymentGateway,
body.kaw-checkout-ultimate-ready #onlineGatewayBox,
body.kaw-checkout-ultimate-ready #kawSimpleCheckoutPay {
  display: none !important;
}

#kawCheckoutUltimateApp {
  display: block !important;
  position: relative;
  width: min(1240px, calc(100% - 40px));
  margin: clamp(30px, 5vw, 58px) auto 72px;
  color: var(--kaw-espresso);
  isolation: isolate;
}

#kawCheckoutUltimateApp::before {
  content: "";
  position: absolute;
  width: min(44vw, 520px);
  height: min(44vw, 520px);
  right: -14%;
  top: 4%;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(201,160,92,0.13), transparent 68%);
  filter: blur(10px);
  pointer-events: none;
  z-index: 0;
}

.kaw-co-top {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 26px;
}

.kaw-co-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--kaw-brown);
  text-decoration: none;
  font-weight: 800;
}

.kaw-co-steps {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 7px;
  border-radius: 999px;
  background: rgba(255,250,246,0.58);
  border: 1px solid rgba(93,67,45,0.10);
}

.kaw-co-step {
  padding: 9px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 900;
  color: var(--kaw-muted);
}

.kaw-co-step.is-active {
  background: var(--kaw-espresso);
  color: #fffaf6;
}

.kaw-co-layout {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(360px, 0.8fr);
  gap: 28px;
  align-items: start;
}

.kaw-co-card {
  border-radius: 30px;
  background:
    radial-gradient(circle at 12% 0%, rgba(201,160,92,0.10), transparent 40%),
    rgba(255,250,246,0.78);
  border: 1px solid rgba(93,67,45,0.10);
  box-shadow: var(--kaw-shadow);
  overflow: hidden;
}

.kaw-co-card-head {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(93,67,45,0.10);
}

.kaw-co-num {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--kaw-espresso);
  color: #fffaf6;
  font-weight: 900;
}

.kaw-co-card-head h2 {
  margin: 0;
  color: var(--kaw-espresso);
  font-size: clamp(1.25rem, 2vw, 1.7rem);
  line-height: 1.15;
}

.kaw-co-cart {
  display: grid;
  gap: 14px;
  padding: 20px 24px 24px;
}

.kaw-co-item {
  display: grid;
  grid-template-columns: 78px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px;
  border-radius: 22px;
  background: rgba(255,255,255,0.52);
  border: 1px solid rgba(93,67,45,0.10);
}

.kaw-co-item img {
  width: 78px;
  height: 78px;
  border-radius: 17px;
  object-fit: cover;
  background: #eadfd3;
}

.kaw-co-info {
  min-width: 0;
}

.kaw-co-info strong {
  display: block;
  color: var(--kaw-espresso);
  font-size: 1rem;
  line-height: 1.35;
  margin-bottom: 5px;
}

.kaw-co-info span {
  color: var(--kaw-muted);
  font-size: 0.82rem;
  line-height: 1.4;
}

.kaw-co-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.kaw-co-controls button {
  width: 31px;
  height: 31px;
  border-radius: 999px;
  border: 1px solid rgba(93,67,45,0.14);
  background: rgba(255,255,255,0.78);
  color: var(--kaw-espresso);
  cursor: pointer;
  font-weight: 900;
  font-size: 1rem;
}

.kaw-co-controls b {
  min-width: 24px;
  text-align: center;
  color: var(--kaw-espresso);
  font-size: 0.94rem;
}

.kaw-co-price {
  display: grid;
  justify-items: end;
  gap: 12px;
  font-weight: 900;
  color: var(--kaw-brown);
  white-space: nowrap;
}

.kaw-co-remove {
  border: 0;
  background: transparent;
  color: #a44738;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.78rem;
}

.kaw-co-totals {
  display: grid;
  gap: 12px;
  margin-top: 8px;
  padding-top: 18px;
  border-top: 1px solid rgba(93,67,45,0.14);
}

.kaw-co-total-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: var(--kaw-brown);
  font-size: 0.96rem;
}

.kaw-co-total-line strong {
  color: var(--kaw-espresso);
}

.kaw-co-total-line.is-grand {
  margin-top: 8px;
  font-size: 1.12rem;
}

.kaw-co-total-line.is-grand strong {
  font-size: clamp(1.7rem, 3vw, 2.35rem);
  letter-spacing: -0.04em;
}

.kaw-co-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.kaw-co-trust span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 34px;
  padding: 0 13px;
  border-radius: 999px;
  background: rgba(255,250,246,0.70);
  border: 1px solid rgba(93,67,45,0.08);
  color: var(--kaw-brown);
  font-size: 0.78rem;
  font-weight: 800;
}

.kaw-co-trust span::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #28c779;
}

/* Payment */
.kaw-pay-panel {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.kaw-pay-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.kaw-pay-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2d2119, #4b3324);
  color: #f6deb0;
  font-weight: 900;
  letter-spacing: 0.08em;
  box-shadow: 0 12px 24px rgba(45,33,25,0.16);
}

.kaw-pay-head h3 {
  margin: 0;
  color: var(--kaw-espresso);
  font-size: 1.06rem;
}

.kaw-pay-head p {
  margin: 5px 0 0;
  color: var(--kaw-muted);
  font-size: 0.84rem;
  line-height: 1.55;
}

.kaw-pay-total {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(45,33,25,0.05);
  border: 1px solid rgba(93,67,45,0.10);
}

.kaw-pay-total span {
  color: var(--kaw-muted);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.kaw-pay-total strong {
  color: var(--kaw-espresso);
  font-size: 1.15rem;
}

.kaw-pay-address {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 14px;
  align-items: center;
  padding: 16px;
  border-radius: 22px;
  background: rgba(255,255,255,0.52);
  border: 1px solid rgba(93,67,45,0.10);
}

.kaw-pay-address span {
  grid-column: 1 / -1;
  color: #8b6847;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 900;
}

.kaw-pay-address strong {
  color: var(--kaw-espresso);
  font-size: clamp(1.08rem, 2vw, 1.42rem);
  line-height: 1.2;
  word-break: break-word;
}

.kaw-pay-copy {
  min-height: 42px;
  border: 0;
  border-radius: 14px;
  padding: 0 16px;
  background: var(--kaw-espresso);
  color: #fffaf6;
  font-weight: 900;
  cursor: pointer;
}

.kaw-pay-fields {
  display: grid;
  gap: 10px;
}

.kaw-pay-fields input,
.kaw-pay-fields textarea {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(93,67,45,0.12);
  background: rgba(255,255,255,0.72);
  color: var(--kaw-espresso);
  padding: 12px 14px;
  font: inherit;
  font-size: 0.88rem;
  outline: none;
  box-sizing: border-box;
}

.kaw-pay-fields textarea {
  resize: vertical;
}

.kaw-pay-confirm {
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, #2d2119, #4b3324);
  color: #fffaf6;
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 16px 32px rgba(45,33,25,0.15);
}

.kaw-pay-status {
  display: none;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(201,160,92,0.12);
  color: var(--kaw-brown);
  font-size: 0.82rem;
  line-height: 1.55;
}

.kaw-pay-status.show {
  display: block;
}

.kaw-pay-note {
  margin: 0;
  color: var(--kaw-muted);
  font-size: 0.76rem;
  line-height: 1.6;
}

.kaw-co-empty {
  padding: 28px;
  text-align: center;
  color: var(--kaw-muted);
}

.kaw-co-empty strong {
  display: block;
  color: var(--kaw-espresso);
  font-size: 1.05rem;
  margin-bottom: 8px;
}

.kaw-co-empty a {
  display: inline-flex;
  margin-top: 14px;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 999px;
  background: var(--kaw-espresso);
  color: #fffaf6;
  text-decoration: none;
  font-weight: 900;
}

@media (max-width: 960px) {
  #kawCheckoutUltimateApp {
    width: min(100% - 24px, 1240px);
    margin-top: 24px;
  }

  .kaw-co-layout {
    grid-template-columns: 1fr;
  }

  .kaw-co-top {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .kaw-co-card {
    border-radius: 24px;
  }

  .kaw-co-card-head {
    padding: 18px;
  }

  .kaw-co-cart,
  .kaw-pay-panel {
    padding: 15px;
  }

  .kaw-co-item {
    grid-template-columns: 64px 1fr;
    gap: 12px;
  }

  .kaw-co-item img {
    width: 64px;
    height: 64px;
  }

  .kaw-co-price {
    grid-column: 1 / -1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    justify-items: start;
  }

  .kaw-pay-address {
    grid-template-columns: 1fr;
  }

  .kaw-pay-copy {
    width: 100%;
  }
}
CSS

cat > js/kawthar-checkout-ultimate.js <<'JS'
(function () {
  "use strict";

  if (!/checkout\.html/i.test(location.pathname)) return;

  const WA = "201034110499";
  const IPA = "kawthar@instapay";
  const SHIPPING = 50;

  let cart = [];

  function money(value) {
    const n = Math.max(0, Math.round(Number(value || 0)));
    return `EGP ${n.toLocaleString("en-EG")}`;
  }

  function esc(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fallbackName(item) {
    if (window.KawtharCart) return window.KawtharCart.nameOf(item);
    if (typeof item.name === "string") return item.name;
    if (item.name?.en) return item.name.en;
    if (item.title) return item.title;
    return "KAWTHAR product";
  }

  function fallbackPrice(item) {
    if (window.KawtharCart) return window.KawtharCart.priceOf(item);
    return Number(item.price || item.salePrice || item.finalPrice || 0);
  }

  function fallbackQty(item) {
    if (window.KawtharCart) return window.KawtharCart.qtyOf(item);
    return Math.max(1, Number(item.quantity || item.qty || 1));
  }

  function fallbackImage(item) {
    if (window.KawtharCart) return window.KawtharCart.imageOf(item);
    return item.image || item.img || item.thumbnail || "./assets/logo/kawthar-logo-hd.webp";
  }

  function fallbackCategory(item) {
    if (window.KawtharCart) return window.KawtharCart.categoryOf(item);
    return item.category || item.type || "Stainless Steel Anti Rust";
  }

  function normalize(items) {
    if (window.KawtharCart) return window.KawtharCart.merge(items);
    return items;
  }

  function readCart() {
    if (window.KawtharCart) {
      return window.KawtharCart.read();
    }

    try {
      return JSON.parse(localStorage.getItem("kawthar_cart") || "[]");
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    cart = normalize(items);

    if (window.KawtharCart) {
      cart = window.KawtharCart.write(cart);
    } else {
      localStorage.setItem("kawthar_cart", JSON.stringify(cart));
    }

    render();
  }

  function subtotal() {
    return cart.reduce((sum, item) => {
      return sum + fallbackPrice(item) * fallbackQty(item);
    }, 0);
  }

  function shipping() {
    return subtotal() > 0 ? SHIPPING : 0;
  }

  function total() {
    return subtotal() + shipping();
  }

  function ensureRoot() {
    let root = document.getElementById("kawCheckoutUltimateApp");
    if (root) return root;

    root = document.createElement("section");
    root.id = "kawCheckoutUltimateApp";
    root.setAttribute("aria-label", "KAWTHAR checkout");

    const header = document.querySelector("header");
    if (header && header.parentNode) {
      header.insertAdjacentElement("afterend", root);
    } else {
      document.body.insertBefore(root, document.body.firstChild);
    }

    return root;
  }

  function cartRows() {
    if (!cart.length) {
      return `
        <div class="kaw-co-empty">
          <strong>Your selection is empty</strong>
          <p>Go back to the shop and choose your favorite piece.</p>
          <a href="./shop.html">Back to shop</a>
        </div>
      `;
    }

    return cart.map((item, index) => {
      const qty = fallbackQty(item);
      const price = fallbackPrice(item);
      const name = fallbackName(item);
      const img = fallbackImage(item);
      const category = fallbackCategory(item);

      return `
        <article class="kaw-co-item" data-index="${index}">
          <img src="${esc(img)}" alt="${esc(name)}" loading="lazy">
          <div class="kaw-co-info">
            <strong>${esc(name)}</strong>
            <span>${esc(category)}</span>
            <div class="kaw-co-controls">
              <button type="button" data-action="minus" aria-label="Decrease quantity">−</button>
              <b>${qty}</b>
              <button type="button" data-action="plus" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="kaw-co-price">
            <strong>${money(price * qty)}</strong>
            <button type="button" class="kaw-co-remove" data-action="remove">Remove</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function render() {
    const root = ensureRoot();

    document.body.classList.add("kaw-checkout-ultimate-ready");

    root.innerHTML = `
      <div class="kaw-co-top">
        <a href="./shop.html" class="kaw-co-back">‹ Back to shop</a>
        <div class="kaw-co-steps" aria-label="Checkout steps">
          <span class="kaw-co-step">Cart</span>
          <span class="kaw-co-step is-active">Payment</span>
          <span class="kaw-co-step">Confirm</span>
        </div>
      </div>

      <div class="kaw-co-layout">
        <section class="kaw-co-card">
          <div class="kaw-co-card-head">
            <span class="kaw-co-num">1</span>
            <h2>Your selection</h2>
          </div>

          <div class="kaw-co-cart">
            ${cartRows()}

            ${cart.length ? `
              <div class="kaw-co-totals">
                <div class="kaw-co-total-line">
                  <span>Subtotal</span>
                  <strong>${money(subtotal())}</strong>
                </div>
                <div class="kaw-co-total-line">
                  <span>Shipping</span>
                  <strong>${money(shipping())}</strong>
                </div>
                <div class="kaw-co-total-line is-grand">
                  <span>Total</span>
                  <strong>${money(total())}</strong>
                </div>
              </div>

              <div class="kaw-co-trust">
                <span>InstaPay secured</span>
                <span>Stainless steel anti-rust</span>
                <span>Direct from KAWTHAR</span>
              </div>
            ` : ""}
          </div>
        </section>

        <section class="kaw-co-card">
          <div class="kaw-co-card-head">
            <span class="kaw-co-num">2</span>
            <h2>Easy InstaPay payment</h2>
          </div>

          <div class="kaw-pay-panel">
            <div class="kaw-pay-head">
              <div class="kaw-pay-icon">PAY</div>
              <div>
                <h3>Manual InstaPay payment</h3>
                <p>Transfer the amount through InstaPay, then confirm the order on WhatsApp.</p>
              </div>
            </div>

            <div class="kaw-pay-total">
              <span>Total amount</span>
              <strong>${money(total())}</strong>
            </div>

            <div class="kaw-pay-address">
              <span>InstaPay Address</span>
              <strong>${IPA}</strong>
              <button class="kaw-pay-copy" type="button" id="kawUltimateCopy">Copy</button>
            </div>

            <div class="kaw-pay-fields">
              <input id="kawUltimateName" type="text" placeholder="Full name" autocomplete="name">
              <input id="kawUltimatePhone" type="tel" placeholder="Phone number" autocomplete="tel">
              <input id="kawUltimateAddress" type="text" placeholder="Delivery address" autocomplete="street-address">
              <textarea id="kawUltimateRef" rows="3" placeholder="Payment reference or note optional"></textarea>
            </div>

            <button class="kaw-pay-confirm" type="button" id="kawUltimateConfirm">
              Confirm payment on WhatsApp
            </button>

            <div class="kaw-pay-status" id="kawUltimateStatus"></div>

            <p class="kaw-pay-note">
              After pressing confirm, send the transfer screenshot in WhatsApp to finish the order smoothly.
            </p>
          </div>
        </section>
      </div>
    `;

    bindRoot();
  }

  function setStatus(message, error) {
    const box = document.getElementById("kawUltimateStatus");
    if (!box) return;

    box.textContent = message;
    box.classList.add("show");
    box.style.background = error ? "rgba(160,50,35,0.12)" : "rgba(201,160,92,0.12)";
    box.style.color = error ? "#7c2a20" : "#4b3829";
  }

  async function copyIpa() {
    try {
      await navigator.clipboard.writeText(IPA);
      setStatus("InstaPay address copied successfully.");
    } catch {
      setStatus("Copy failed. Please copy the InstaPay address manually.", true);
    }
  }

  function buildMessage() {
    const name = document.getElementById("kawUltimateName")?.value.trim() || "";
    const phone = document.getElementById("kawUltimatePhone")?.value.trim() || "";
    const address = document.getElementById("kawUltimateAddress")?.value.trim() || "";
    const ref = document.getElementById("kawUltimateRef")?.value.trim() || "";

    const lines = cart.length
      ? cart.map((item, index) => {
          const qty = fallbackQty(item);
          return `${index + 1}. ${fallbackName(item)} × ${qty} = ${money(fallbackPrice(item) * qty)}`;
        }).join("\n")
      : "No cart items detected.";

    return [
      "Hi KAWTHAR, I want to confirm my payment.",
      "",
      "Customer details:",
      `Name: ${name || "Not provided"}`,
      `Phone: ${phone || "Not provided"}`,
      `Address: ${address || "Not provided"}`,
      "",
      "Order:",
      lines,
      "",
      `Subtotal: ${money(subtotal())}`,
      `Shipping: ${money(shipping())}`,
      `Total: ${money(total())}`,
      `Payment method: InstaPay`,
      `InstaPay address: ${IPA}`,
      `Reference: ${ref || "Screenshot will be sent"}`,
      "",
      "I will send the payment screenshot here."
    ].join("\n");
  }

  function confirmPayment() {
    if (!cart.length) {
      setStatus("Your selection is empty. Please add products first.", true);
      return;
    }

    const name = document.getElementById("kawUltimateName")?.value.trim() || "";
    const phone = document.getElementById("kawUltimatePhone")?.value.trim() || "";

    if (!name || !phone) {
      setStatus("Please enter your name and phone number first.", true);
      return;
    }

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(buildMessage())}`, "_blank");
  }

  function bindRoot() {
    const root = document.getElementById("kawCheckoutUltimateApp");
    if (!root || root.dataset.bound === "1") return;

    root.dataset.bound = "1";

    root.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-action]");
      if (!btn) return;

      event.preventDefault();

      const row = btn.closest("[data-index]");
      if (!row) return;

      const index = Number(row.getAttribute("data-index"));
      const action = btn.getAttribute("data-action");

      if (!cart[index]) return;

      const next = [...cart];

      if (action === "plus") {
        next[index].quantity = fallbackQty(next[index]) + 1;
        next[index].qty = next[index].quantity;
      }

      if (action === "minus") {
        const qty = fallbackQty(next[index]) - 1;
        if (qty <= 0) {
          next.splice(index, 1);
        } else {
          next[index].quantity = qty;
          next[index].qty = qty;
        }
      }

      if (action === "remove") {
        next.splice(index, 1);
      }

      writeCart(next);
    });

    root.addEventListener("click", (event) => {
      if (event.target.closest("#kawUltimateCopy")) copyIpa();
      if (event.target.closest("#kawUltimateConfirm")) confirmPayment();
    });
  }

  function boot() {
    cart = normalize(readCart());

    if (window.KawtharCart) {
      cart = window.KawtharCart.write(cart);
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("kawthar:cart-updated", (event) => {
    const next = normalize(event.detail || readCart());
    if (JSON.stringify(next) !== JSON.stringify(cart)) {
      cart = next;
      render();
    }
  });

  console.info("KAWTHAR Checkout Ultimate loaded.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

ver = str(int(time.time()))

pages = ["index.html", "shop.html", "product.html", "checkout.html"]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8")

    text = re.sub(r'\s*<script src="\./js/kawthar-cart-core\.js\?v=[^"]*"></script>', '', text)

    if "</head>" in text:
        text = text.replace(
            "</head>",
            f'  <script src="./js/kawthar-cart-core.js?v={ver}"></script>\n</head>',
            1
        )

    p.write_text(text, encoding="utf-8")

p = Path("checkout.html")
text = p.read_text(encoding="utf-8")

# Remove previous checkout patches that conflict with the isolated checkout app
remove_patterns = [
    r'\s*<link rel="stylesheet" href="\./css/kawthar-checkout-cart-fix\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-checkout-cart-fix\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-checkout-payment-restore\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-checkout-payment-restore\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/zz-checkout-unlock\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/checkout-unlock-clean\.js\?v=[^"]*"></script>',
    r'\s*<script src="\./js/checkout-payment-gateway\.js\?v=[^"]*"></script>',
    r'\s*<script src="\./js/kawthar-checkout-final\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-checkout-ultimate\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-checkout-ultimate\.js\?v=[^"]*"></script>',
]

for pat in remove_patterns:
    text = re.sub(pat, '', text)

text = text.replace(
    "</head>",
    f'  <link rel="stylesheet" href="./css/kawthar-checkout-ultimate.css?v={ver}" />\n</head>',
    1
)

text = text.replace(
    "</body>",
    f'  <script src="./js/kawthar-checkout-ultimate.js?v={ver}"></script>\n</body>',
    1
)

p.write_text(text, encoding="utf-8")

print("Ultimate checkout linked.")
print("Version:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-cart-core.js
  node --check js/kawthar-checkout-ultimate.js
fi

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/checkout.html?v=ultimate-$STAMP"
