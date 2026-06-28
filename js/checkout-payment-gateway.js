(function () {
  /*
    KAWTHAR Simple Manual Payment
    One clean payment block only.
    No Paymob. No QR block. No duplicate InstaPay cards.
  */

  const OWNER_WHATSAPP = "201034110499";

  const PAYMENT_DETAILS = {
    instapayAlias: "kawtharabdo@instapay",
    receiverName: "KAWTHAR"
  };

  const CART_KEYS = ["kawtharabdo_cart", "cart", "kaw_cart"];

  const readCart = () => {
    for (const key of CART_KEYS) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(data) && data.length) return data;
      } catch {}
    }
    return [];
  };

  const itemName = (item) => {
    if (typeof item.name === "string") return item.name;
    if (item.name?.en) return item.name.en;
    if (item.name?.ar) return item.name.ar;
    if (item.title) return item.title;
    return "KAWTHAR item";
  };

  const itemPrice = (item) => Number(item.price || item.salePrice || item.finalPrice || 0);
  const itemQty = (item) => Math.max(1, Number(item.quantity || item.qty || 1));

  const getTotal = (cart) => {
    return cart.reduce((sum, item) => sum + itemPrice(item) * itemQty(item), 0);
  };

  const formatMoney = (value) => {
    const num = Number(value || 0);
    return num > 0 ? `${num.toLocaleString("en-EG")} EGP` : "Ask for price";
  };

  const setStatus = (msg, isError = false) => {
    const box = document.getElementById("manualGatewayStatus");
    if (!box) return;
    box.textContent = msg;
    box.classList.add("show");
    box.style.background = isError ? "rgba(160, 50, 35, 0.12)" : "rgba(201,160,92,0.13)";
    box.style.color = isError ? "#7c2a20" : "#4b3829";
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("InstaPay address copied successfully.");
    } catch {
      setStatus("Copy failed. Please copy the InstaPay address manually.", true);
    }
  };

  const buildOrderMessage = () => {
    const cart = readCart();
    const total = getTotal(cart);

    const customerName = document.getElementById("manualCustomerName")?.value.trim() || "";
    const customerPhone = document.getElementById("manualCustomerPhone")?.value.trim() || "";
    const customerAddress = document.getElementById("manualCustomerAddress")?.value.trim() || "";
    const paymentRef = document.getElementById("manualPaymentRef")?.value.trim() || "";

    const lines = cart.length
      ? cart.map((item, index) => {
          const qty = itemQty(item);
          const price = itemPrice(item);
          const subtotal = price * qty;
          return `${index + 1}. ${itemName(item)} × ${qty} = ${formatMoney(subtotal)}`;
        }).join("\n")
      : "No cart items found. Customer needs help completing the order.";

    return [
      "Hi KAWTHAR, I want to confirm my order.",
      "",
      "Customer details:",
      `Name: ${customerName || "Not provided"}`,
      `Phone: ${customerPhone || "Not provided"}`,
      `Address: ${customerAddress || "Not provided"}`,
      "",
      "Order:",
      lines,
      "",
      `Total: ${formatMoney(total)}`,
      `Payment method: InstaPay`,
      `InstaPay address: ${PAYMENT_DETAILS.instapayAlias}`,
      `Payment reference: ${paymentRef || "Screenshot will be sent"}`,
      "",
      "I will send the payment screenshot here."
    ].join("\n");
  };

  const openWhatsApp = () => {
    const cart = readCart();
    const customerName = document.getElementById("manualCustomerName")?.value.trim() || "";
    const customerPhone = document.getElementById("manualCustomerPhone")?.value.trim() || "";

    if (!cart.length) {
      setStatus("Cart is empty. Add products first.", true);
      return;
    }

    if (!customerName || !customerPhone) {
      setStatus("Please enter customer name and phone number first.", true);
      return;
    }

    const msg = buildOrderMessage();
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const removeDuplicatePaymentBlocks = () => {
    const keywords = [
      "instapay address",
      "scan qr code",
      "open instapay",
      "kawtharabdo@instapay"
    ];

    const candidates = Array.from(document.querySelectorAll("section, article, aside, div"));

    const matches = candidates
      .filter((el) => {
        if (el.id === "manualPaymentGateway") return false;
        if (el.closest("#manualPaymentGateway")) return false;

        const text = (el.textContent || "").toLowerCase();
        const hasKeyword = keywords.some((k) => text.includes(k));

        if (!hasKeyword) return false;
        if (text.includes("simple payment")) return false;
        if (text.includes("confirm order on whatsapp") && text.includes("manualGatewayStatus")) return false;

        return text.length < 1400;
      })
      .sort((a, b) => (a.textContent || "").length - (b.textContent || "").length);

    for (const el of matches) {
      if (!document.body.contains(el)) continue;
      if (el.closest("#manualPaymentGateway")) continue;

      let block = el;

      for (let i = 0; i < 3; i++) {
        const parent = block.parentElement;
        if (!parent || parent === document.body) break;

        const parentText = (parent.textContent || "").toLowerCase();
        const parentHasKeyword = keywords.some((k) => parentText.includes(k));

        if (parentHasKeyword && parentText.length < 1600) {
          block = parent;
        } else {
          break;
        }
      }

      if (block && block !== document.body && !block.closest("#manualPaymentGateway")) {
        block.remove();
      }
    }
  };

  const mountGateway = () => {
    removeDuplicatePaymentBlocks();

    const panelBody =
      document.querySelector("#payPanel .panel-body") ||
      document.querySelector(".checkout-payment") ||
      document.querySelector("main");

    if (!panelBody) return;

    document.querySelectorAll("#manualPaymentGateway").forEach((el) => el.remove());

    const total = formatMoney(getTotal(readCart()));

    panelBody.insertAdjacentHTML("afterbegin", `
      <div class="manual-payment-gateway simple-payment" id="manualPaymentGateway">
        <div class="manual-gateway-head">
          <div class="manual-gateway-icon">PAY</div>
          <div>
            <h3>Easy payment</h3>
            <p>Transfer through InstaPay, then confirm your order on WhatsApp.</p>
          </div>
        </div>

        <div class="manual-total-box">
          <span>Order total</span>
          <strong id="manualGatewayTotal">${total}</strong>
        </div>

        <div class="simple-instapay-box">
          <span>InstaPay Address</span>
          <strong>${PAYMENT_DETAILS.instapayAlias}</strong>
          <button type="button" id="copyInstapayBtn" aria-label="Copy InstaPay address">
            Copy
          </button>
        </div>

        <div class="manual-fields">
          <input id="manualCustomerName" type="text" placeholder="Full name" autocomplete="name">
          <input id="manualCustomerPhone" type="tel" placeholder="Phone number" autocomplete="tel">
          <input id="manualCustomerAddress" type="text" placeholder="Delivery address" autocomplete="street-address">
          <input id="manualPaymentRef" type="text" placeholder="Payment reference optional">
        </div>

        <button class="manual-confirm-btn" id="manualConfirmBtn" type="button">
          Confirm order on WhatsApp
        </button>

        <div class="manual-gateway-status" id="manualGatewayStatus"></div>

        <p class="manual-note">
          After payment, press confirm and send the transfer screenshot on WhatsApp.
        </p>
      </div>
    `);

    document.getElementById("copyInstapayBtn")?.addEventListener("click", () => {
      copyText(PAYMENT_DETAILS.instapayAlias);
    });

    document.getElementById("manualConfirmBtn")?.addEventListener("click", openWhatsApp);

    setTimeout(removeDuplicatePaymentBlocks, 500);
    setTimeout(removeDuplicatePaymentBlocks, 1500);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountGateway);
  } else {
    mountGateway();
  }
})();
