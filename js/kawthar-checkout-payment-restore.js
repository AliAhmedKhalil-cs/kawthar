(function () {
  "use strict";

  if (!/checkout\.html/i.test(location.pathname)) return;

  const IPA = "kawtharabdo@instapay";
  const WA = "201034110499";
  const SHIPPING = 50;
  const CART_KEYS = ["kawtharabdo_cart", "kaw_cart", "cart", "kawtharabdo_selection", "selection"];

  function money(n) {
    n = Math.max(0, Math.round(Number(n || 0)));
    return `EGP ${n.toLocaleString("en-EG")}`;
  }

  function getQty(item) {
    return Math.max(1, Number(item.quantity || item.qty || item.count || 1));
  }

  function getPrice(item) {
    return Number(item.price || item.salePrice || item.finalPrice || item.unitPrice || 0);
  }

  function getName(item) {
    if (typeof item.name === "string") return item.name;
    if (item.name?.en) return item.name.en;
    if (item.name?.ar) return item.name.ar;
    if (item.title) return item.title;
    return "KAWTHAR product";
  }

  function readCart() {
    for (const key of CART_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length) return data;
      } catch {}
    }
    return [];
  }

  function subtotal(items) {
    return items.reduce((sum, item) => sum + getPrice(item) * getQty(item), 0);
  }

  function total() {
    const items = readCart();
    const sub = subtotal(items);
    return sub > 0 ? sub + SHIPPING : 0;
  }

  function setStatus(msg, error) {
    const box = document.getElementById("kawPayStatus");
    if (!box) return;
    box.textContent = msg;
    box.classList.add("show");
    box.style.background = error ? "rgba(160,50,35,0.12)" : "rgba(201,160,92,0.12)";
    box.style.color = error ? "#7c2a20" : "#4b3829";
  }

  function paymentHeadingBlock() {
    const nodes = Array.from(document.querySelectorAll("h1,h2,h3,strong,div,span"));
    const match = nodes.find((el) => {
      const t = (el.textContent || "").trim().toLowerCase();
      return t === "easy instapay payment" || t.includes("easy instapay payment");
    });

    if (!match) {
      return document.querySelector("main");
    }

    let node = match;
    for (let i = 0; i < 4 && node && node !== document.body; i++) {
      const text = (node.textContent || "").toLowerCase();
      if (text.includes("easy instapay payment")) return node;
      node = node.parentElement;
    }

    return match.parentElement || document.querySelector("main");
  }

  function mount() {
    const target = paymentHeadingBlock();
    if (!target) return;

    const existing = document.getElementById("kawPaymentPanel");
    if (!existing) {
      const html = `
        <section id="kawPaymentPanel" aria-label="KAWTHAR payment panel">
          <div class="kaw-pay-head">
            <div class="kaw-pay-icon">PAY</div>
            <div>
              <h3>Manual InstaPay payment</h3>
              <p>Transfer the amount through InstaPay, then confirm the order on WhatsApp.</p>
            </div>
          </div>

          <div class="kaw-pay-total">
            <span>Total amount</span>
            <strong id="kawPayTotal">EGP 0</strong>
          </div>

          <div class="kaw-pay-address">
            <span>InstaPay Address</span>
            <strong id="kawPayAlias">${IPA}</strong>
            <button class="kaw-pay-copy" type="button" id="kawPayCopyBtn">Copy</button>
          </div>

          <div class="kaw-pay-steps">
            <div class="kaw-pay-step"><b>1</b><div>Copy the InstaPay address and transfer the total amount shown.</div></div>
            <div class="kaw-pay-step"><b>2</b><div>Enter your details below so the order can be confirmed correctly.</div></div>
            <div class="kaw-pay-step"><b>3</b><div>Press confirm to open WhatsApp and send the payment confirmation.</div></div>
          </div>

          <div class="kaw-pay-fields">
            <input id="kawPayName" type="text" placeholder="Full name" autocomplete="name">
            <input id="kawPayPhone" type="tel" placeholder="Phone number" autocomplete="tel">
            <input id="kawPayAddress" type="text" placeholder="Delivery address" autocomplete="street-address">
            <textarea id="kawPayRef" rows="3" placeholder="Payment reference or note optional"></textarea>
          </div>

          <button class="kaw-pay-confirm" type="button" id="kawPayConfirmBtn">Confirm payment on WhatsApp</button>

          <div class="kaw-pay-status" id="kawPayStatus"></div>

          <p class="kaw-pay-note">After pressing confirm, send the transfer screenshot in WhatsApp to finish the order smoothly.</p>
        </section>
      `;

      target.insertAdjacentHTML("afterend", html);
    }

    syncTotal();
    bind();
    hideOldPaymentArtifacts();
  }

  function hideOldPaymentArtifacts() {
    document.querySelectorAll(".ipa-qr-card,.ipa-qr-wrap,.ipa-steps-guide,#qrCanvas,#onlineGatewayBox")
      .forEach((el) => el.classList.add("kaw-pay-hidden-old"));
  }

  function syncTotal() {
    const el = document.getElementById("kawPayTotal");
    if (!el) return;
    el.textContent = money(total());
  }

  async function copyAlias() {
    try {
      await navigator.clipboard.writeText(IPA);
      setStatus("InstaPay address copied successfully.");
    } catch {
      setStatus("Copy failed. Please copy the address manually.", true);
    }
  }

  function buildMessage() {
    const items = readCart();
    const name = document.getElementById("kawPayName")?.value.trim() || "";
    const phone = document.getElementById("kawPayPhone")?.value.trim() || "";
    const address = document.getElementById("kawPayAddress")?.value.trim() || "";
    const ref = document.getElementById("kawPayRef")?.value.trim() || "";

    const lines = items.length
      ? items.map((item, i) => `${i + 1}. ${getName(item)} × ${getQty(item)} = ${money(getPrice(item) * getQty(item))}`).join("\n")
      : "No items detected in cart.";

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
      `Total: ${money(total())}`,
      `Payment method: InstaPay`,
      `InstaPay address: ${IPA}`,
      `Reference: ${ref || "Screenshot will be sent"}`,
      "",
      "I will send the payment screenshot here."
    ].join("\n");
  }

  function confirmPayment() {
    const name = document.getElementById("kawPayName")?.value.trim() || "";
    const phone = document.getElementById("kawPayPhone")?.value.trim() || "";

    if (!name || !phone) {
      setStatus("Please enter your name and phone number first.", true);
      return;
    }

    const msg = buildMessage();
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  function bind() {
    const copyBtn = document.getElementById("kawPayCopyBtn");
    const confirmBtn = document.getElementById("kawPayConfirmBtn");

    if (copyBtn && !copyBtn.dataset.bound) {
      copyBtn.dataset.bound = "1";
      copyBtn.addEventListener("click", copyAlias);
    }

    if (confirmBtn && !confirmBtn.dataset.bound) {
      confirmBtn.dataset.bound = "1";
      confirmBtn.addEventListener("click", confirmPayment);
    }
  }

  function run() {
    mount();
    syncTotal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  window.addEventListener("kawtharabdo:cart-updated", syncTotal);
  window.addEventListener("storage", syncTotal);

  setTimeout(run, 500);
  setTimeout(run, 1500);

  console.info("KAWTHAR checkout payment restore loaded.");
})();
