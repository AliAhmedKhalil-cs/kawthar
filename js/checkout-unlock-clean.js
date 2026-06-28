(function () {
  const OWNER_WHATSAPP = "201034110499";
  const INSTAPAY = "kawtharabdo@instapay";

  function unlockPage() {
    document.querySelectorAll("#splashScreen,.splash-screen,#goStartup,.go-startup,[role='status']")
      .forEach((el) => {
        const txt = (el.textContent || "").toLowerCase();
        if (
          el.id === "splashScreen" ||
          el.id === "goStartup" ||
          el.className.toString().toLowerCase().includes("splash") ||
          txt.includes("loading")
        ) {
          el.remove();
        }
      });

    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
    document.body.style.opacity = "1";
    document.body.style.visibility = "visible";

    const shell = document.querySelector(".site-shell");
    if (shell) {
      shell.style.opacity = "1";
      shell.style.visibility = "visible";
      shell.style.transform = "none";
    }
  }

  function getCart() {
    const keys = ["kawtharabdo_cart", "cart", "kaw_cart"];
    for (const key of keys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(data) && data.length) return data;
      } catch {}
    }
    return [];
  }

  function itemName(item) {
    if (typeof item.name === "string") return item.name;
    if (item.name?.en) return item.name.en;
    if (item.name?.ar) return item.name.ar;
    if (item.title) return item.title;
    return "KAWTHAR item";
  }

  function itemPrice(item) {
    return Number(item.price || item.salePrice || item.finalPrice || 0);
  }

  function itemQty(item) {
    return Math.max(1, Number(item.quantity || item.qty || 1));
  }

  function totalFromCart(cart) {
    return cart.reduce((sum, item) => sum + itemPrice(item) * itemQty(item), 0);
  }

  function money(value) {
    const n = Number(value || 0);
    return n > 0 ? `${n.toLocaleString("en-EG")} EGP` : "Ask for price";
  }

  function visibleTotalFallback() {
    const text = document.body.textContent || "";
    const match = text.match(/Total amount to transfer\s*([\s\S]{0,80})/i);
    if (!match) return "—";
    const found = match[1].replace(/\s+/g, " ").trim();
    return found && found !== "Copy" ? found : "—";
  }

  function setStatus(msg, error) {
    const box = document.getElementById("kawPayStatus");
    if (!box) return;
    box.textContent = msg;
    box.classList.add("show");
    box.style.background = error ? "rgba(160,50,35,0.12)" : "rgba(201,160,92,0.13)";
    box.style.color = error ? "#7c2a20" : "#4b3829";
  }

  function buildMessage() {
    const cart = getCart();
    const total = totalFromCart(cart);

    const name = document.getElementById("kawCustomerName")?.value.trim() || "";
    const phone = document.getElementById("kawCustomerPhone")?.value.trim() || "";
    const address = document.getElementById("kawCustomerAddress")?.value.trim() || "";
    const ref = document.getElementById("kawPaymentRef")?.value.trim() || "";

    const lines = cart.length
      ? cart.map((item, index) => {
          const qty = itemQty(item);
          const subtotal = itemPrice(item) * qty;
          return `${index + 1}. ${itemName(item)} × ${qty} = ${money(subtotal)}`;
        }).join("\n")
      : "Cart details were not detected. Customer is confirming from checkout page.";

    return [
      "Hi KAWTHAR, I want to confirm my order.",
      "",
      "Customer details:",
      `Name: ${name || "Not provided"}`,
      `Phone: ${phone || "Not provided"}`,
      `Address: ${address || "Not provided"}`,
      "",
      "Order:",
      lines,
      "",
      `Total: ${total > 0 ? money(total) : visibleTotalFallback()}`,
      `Payment method: InstaPay`,
      `InstaPay address: ${INSTAPAY}`,
      `Payment reference: ${ref || "Screenshot will be sent"}`,
      "",
      "I will send the payment screenshot here."
    ].join("\n");
  }

  async function copyInstapay() {
    try {
      await navigator.clipboard.writeText(INSTAPAY);
      setStatus("InstaPay address copied successfully.");
    } catch {
      setStatus("Copy failed. Please copy the address manually.", true);
    }
  }

  function confirmWhatsApp() {
    const name = document.getElementById("kawCustomerName")?.value.trim() || "";
    const phone = document.getElementById("kawCustomerPhone")?.value.trim() || "";

    if (!name || !phone) {
      setStatus("Please enter your name and phone number first.", true);
      return;
    }

    const msg = buildMessage();
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  function removeOldPaymentQr() {
    const keywords = ["scan qr code", "instapay address (ipa)", "open instapay"];
    const candidates = Array.from(document.querySelectorAll("section, article, aside, div"));

    candidates.forEach((el) => {
      if (!document.body.contains(el)) return;
      if (el.closest("#kawSimpleCheckoutPay")) return;

      const text = (el.textContent || "").toLowerCase();
      if (!keywords.some((k) => text.includes(k))) return;

      if (text.length < 1800) {
        el.remove();
      }
    });
  }

  function findPaymentTarget() {
    const candidates = Array.from(document.querySelectorAll("section, article, aside, div"))
      .filter((el) => {
        const text = (el.textContent || "").toLowerCase();
        return text.includes("pay via instapay") || text.includes("instant bank transfer") || text.includes("total amount to transfer");
      })
      .sort((a, b) => (a.textContent || "").length - (b.textContent || "").length);

    return candidates[0] || document.querySelector("main") || document.body;
  }

  function mountSimplePayment() {
    if (document.getElementById("kawSimpleCheckoutPay")) return;

    removeOldPaymentQr();

    const cart = getCart();
    const cartTotal = totalFromCart(cart);
    const totalText = cartTotal > 0 ? money(cartTotal) : visibleTotalFallback();

    const html = `
      <section class="kaw-simple-checkout-pay" id="kawSimpleCheckoutPay" aria-label="KAWTHAR easy payment">
        <div class="kaw-simple-pay-head">
          <div class="kaw-simple-pay-icon">PAY</div>
          <div>
            <h3>Easy payment</h3>
            <p>Transfer through InstaPay, then confirm your order on WhatsApp.</p>
          </div>
        </div>

        <div class="kaw-simple-total">
          <span>Order total</span>
          <strong>${totalText}</strong>
        </div>

        <div class="kaw-instapay-line">
          <span>InstaPay Address</span>
          <strong>${INSTAPAY}</strong>
          <button class="kaw-copy-btn" type="button" id="kawCopyInstapay">Copy</button>
        </div>

        <div class="kaw-checkout-fields">
          <input id="kawCustomerName" type="text" placeholder="Full name" autocomplete="name">
          <input id="kawCustomerPhone" type="tel" placeholder="Phone number" autocomplete="tel">
          <input id="kawCustomerAddress" type="text" placeholder="Delivery address" autocomplete="street-address">
          <input id="kawPaymentRef" type="text" placeholder="Payment reference optional">
        </div>

        <button class="kaw-whatsapp-confirm" type="button" id="kawConfirmWhatsApp">
          Confirm order on WhatsApp
        </button>

        <div class="kaw-pay-status" id="kawPayStatus"></div>

        <p class="kaw-pay-note">
          After payment, press confirm and send the transfer screenshot on WhatsApp.
        </p>
      </section>
    `;

    const target = findPaymentTarget();

    if (target && target !== document.body) {
      target.insertAdjacentHTML("beforebegin", html);
    } else {
      document.body.insertAdjacentHTML("afterbegin", html);
    }

    document.getElementById("kawCopyInstapay")?.addEventListener("click", copyInstapay);
    document.getElementById("kawConfirmWhatsApp")?.addEventListener("click", confirmWhatsApp);

    setTimeout(removeOldPaymentQr, 300);
    setTimeout(removeOldPaymentQr, 1000);
  }

  function run() {
    unlockPage();
    mountSimplePayment();
  }

  unlockPage();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 300);
  setTimeout(run, 1000);
  setTimeout(unlockPage, 2000);
})();
