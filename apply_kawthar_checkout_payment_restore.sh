#!/usr/bin/env bash
set -e

echo "=== KAWTHAR CHECKOUT PAYMENT RESTORE ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-checkout-payment-restore-$STAMP.tar.gz" checkout.html css js 2>/dev/null || true

cat > css/kawthar-checkout-payment-restore.css <<'CSS'
/* =========================================================
   KAWTHAR CHECKOUT PAYMENT RESTORE
   Restores a strong InstaPay payment card and confirm button.
   Safe additive patch.
   ========================================================= */

:root {
  --kaw-espresso: #2d2119;
  --kaw-brown: #4b3829;
  --kaw-soft-brown: #7a624e;
  --kaw-gold: #c9a05c;
  --kaw-gold-soft: rgba(201,160,92,0.14);
  --kaw-ivory: #fffaf6;
  --kaw-stroke: rgba(93,67,45,0.12);
  --kaw-shadow: 0 20px 48px rgba(45,33,25,0.09);
}

#kawPaymentPanel {
  display: grid;
  gap: 16px;
  margin-top: 16px;
  padding: 18px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 10% 0%, rgba(201,160,92,0.14), transparent 40%),
    rgba(255,250,246,0.78);
  border: 1px solid rgba(93,67,45,0.10);
  box-shadow: var(--kaw-shadow);
}

.kaw-pay-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.kaw-pay-icon {
  width: 52px;
  height: 52px;
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
  line-height: 1.2;
}

.kaw-pay-head p {
  margin: 5px 0 0;
  color: var(--kaw-soft-brown);
  font-size: 0.84rem;
  line-height: 1.55;
}

.kaw-pay-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(45,33,25,0.05);
  border: 1px solid rgba(93,67,45,0.10);
}

.kaw-pay-total span {
  color: var(--kaw-soft-brown);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.kaw-pay-total strong {
  color: var(--kaw-espresso);
  font-size: 1.1rem;
  font-weight: 900;
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
  background: #2d2119;
  color: #fffaf6;
  font-weight: 900;
  cursor: pointer;
  transition: transform 220ms ease, box-shadow 220ms ease;
  box-shadow: 0 12px 24px rgba(45,33,25,0.14);
}

.kaw-pay-copy:hover,
.kaw-pay-confirm:hover {
  transform: translateY(-1px);
}

.kaw-pay-steps {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(255,250,246,0.58);
  border: 1px dashed rgba(201,160,92,0.42);
}

.kaw-pay-step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--kaw-brown);
  font-size: 0.86rem;
  line-height: 1.55;
}

.kaw-pay-step b {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(201,160,92,0.16);
  color: var(--kaw-espresso);
  font-size: 0.74rem;
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
  resize: vertical;
}

.kaw-pay-fields input:focus,
.kaw-pay-fields textarea:focus {
  border-color: rgba(155,106,47,0.54);
  box-shadow: 0 0 0 4px rgba(201,160,92,0.14);
}

.kaw-pay-confirm {
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, #2d2119, #4b3324);
  color: #fffaf6;
  font-weight: 900;
  font-size: 0.92rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 16px 32px rgba(45,33,25,0.15);
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.kaw-pay-status {
  display: none;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(201,160,92,0.12);
  color: #4b3829;
  font-size: 0.82rem;
  line-height: 1.55;
}

.kaw-pay-status.show {
  display: block;
}

.kaw-pay-note {
  margin: 0;
  color: var(--kaw-soft-brown);
  font-size: 0.76rem;
  line-height: 1.6;
}

.kaw-pay-hidden-old,
.ipa-qr-card,
.ipa-qr-wrap,
.ipa-steps-guide,
#qrCanvas,
#onlineGatewayBox {
  display: none !important;
}

@media (max-width: 860px) {
  #kawPaymentPanel {
    border-radius: 24px;
    padding: 15px;
  }
}

@media (max-width: 640px) {
  .kaw-pay-address {
    grid-template-columns: 1fr;
  }

  .kaw-pay-copy {
    width: 100%;
  }

  .kaw-pay-head {
    align-items: flex-start;
  }
}
CSS

cat > js/kawthar-checkout-payment-restore.js <<'JS'
(function () {
  "use strict";

  if (!/checkout\.html/i.test(location.pathname)) return;

  const IPA = "kawthar@instapay";
  const WA = "201034110499";
  const SHIPPING = 50;
  const CART_KEYS = ["kawthar_cart", "kaw_cart", "cart", "kawthar_selection", "selection"];

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

  window.addEventListener("kawthar:cart-updated", syncTotal);
  window.addEventListener("storage", syncTotal);

  setTimeout(run, 500);
  setTimeout(run, 1500);

  console.info("KAWTHAR checkout payment restore loaded.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

p = Path("checkout.html")
if not p.exists():
    raise SystemExit("ERROR: checkout.html not found")

text = p.read_text(encoding="utf-8")
ver = str(int(time.time()))

text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-checkout-payment-restore\.css\?v=[^"]*" />', '', text)
text = re.sub(r'\s*<script src="\./js/kawthar-checkout-payment-restore\.js\?v=[^"]*"></script>', '', text)

text = text.replace(
    "</head>",
    f'  <link rel="stylesheet" href="./css/kawthar-checkout-payment-restore.css?v={ver}" />\n</head>',
    1
)

text = text.replace(
    "</body>",
    f'  <script src="./js/kawthar-checkout-payment-restore.js?v={ver}"></script>\n</body>',
    1
)

p.write_text(text, encoding="utf-8")

print("Checkout payment restore linked.")
print("Version:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-checkout-payment-restore.js
fi

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/checkout.html?v=payment-restore-$STAMP"
