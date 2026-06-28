(function () {
  "use strict";

  if (!/checkout\.html/i.test(location.pathname)) return;

  const WA = "201034110499";
  const IPA = "kawtharabdo@instapay";
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
    return item.image || item.img || item.thumbnail || "./assets/logo/kawthar-logo-hd.webp?v=logo-1782681526";
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
      return JSON.parse(localStorage.getItem("kawtharabdo_cart") || "[]");
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    cart = normalize(items);

    if (window.KawtharCart) {
      cart = window.KawtharCart.write(cart);
    } else {
      localStorage.setItem("kawtharabdo_cart", JSON.stringify(cart));
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

  window.addEventListener("kawtharabdo:cart-updated", (event) => {
    const next = normalize(event.detail || readCart());
    if (JSON.stringify(next) !== JSON.stringify(cart)) {
      cart = next;
      render();
    }
  });

  console.info("KAWTHAR Checkout Ultimate loaded.");
})();
