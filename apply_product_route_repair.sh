#!/usr/bin/env bash
set -e

echo "=== KAWTHAR PRODUCT ROUTE REPAIR ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-product-route-repair-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

cat > css/kawthar-product-route-repair.css <<'CSS'
/* =========================================================
   KAWTHAR PRODUCT ROUTE REPAIR
   One header, fixed product route, compact product page.
   ========================================================= */

:root {
  --kaw-espresso: #2d2119;
  --kaw-brown: #4b3829;
  --kaw-muted: #7a624e;
  --kaw-gold: #c9a05c;
  --kaw-ivory: #fffaf6;
  --kaw-cream: #f5ede4;
  --kaw-stroke: rgba(93,67,45,0.12);
  --kaw-shadow: 0 22px 58px rgba(45,33,25,0.10);
}

body.kaw-product-route-page {
  background:
    radial-gradient(circle at 12% 8%, rgba(201,160,92,0.10), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(255,250,246,0.72), transparent 28%),
    linear-gradient(180deg, #f7efe7 0%, #efe4d8 100%) !important;
  overflow-x: hidden !important;
  color: var(--kaw-espresso) !important;
}

/* Hide old duplicated product chrome */
body.kaw-product-route-page .kaw-product-hide-old {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* Unified product header */
#kawProductUnifiedHeader {
  position: sticky;
  top: 0;
  z-index: 999;
  background: rgba(255,250,246,0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(93,67,45,0.10);
  box-shadow: 0 12px 34px rgba(45,33,25,0.045);
}

.kaw-route-ann {
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1d120b;
  color: #f4d990;
  font-size: 0.7rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  font-weight: 900;
  overflow: hidden;
  white-space: nowrap;
}

.kaw-route-ann span {
  display: inline-flex;
  gap: 28px;
  align-items: center;
}

.kaw-route-nav {
  min-height: 76px;
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
}

.kaw-route-links {
  display: flex;
  gap: clamp(18px, 2.4vw, 32px);
  align-items: center;
}

.kaw-route-links a {
  color: var(--kaw-espresso);
  text-decoration: none;
  font-size: 0.76rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 900;
}

.kaw-route-brand img {
  width: 68px;
  height: 68px;
  object-fit: contain;
  opacity: 0.92;
  filter: drop-shadow(0 12px 20px rgba(45,33,25,0.08));
}

.kaw-route-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
}

.kaw-route-action {
  width: 43px;
  height: 43px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  text-decoration: none;
  color: var(--kaw-espresso);
  background: rgba(255,250,246,0.86);
  border: 1px solid rgba(93,67,45,0.10);
  box-shadow: 0 8px 22px rgba(45,33,25,0.06);
  font-weight: 900;
}

/* Compact product page */
body.kaw-product-route-page .site-shell {
  width: min(1240px, calc(100% - 40px)) !important;
  margin-inline: auto !important;
  padding: clamp(28px, 4vw, 52px) 0 120px !important;
}

body.kaw-product-route-page main,
body.kaw-product-route-page .product-page,
body.kaw-product-route-page .product-detail,
body.kaw-product-route-page .product-page-section,
body.kaw-product-route-page .product-detail-section {
  margin-top: 0 !important;
  padding-top: clamp(18px, 3vw, 36px) !important;
}

body.kaw-product-route-page .kaw-main-product-media {
  width: 100% !important;
  max-width: 580px !important;
  height: clamp(320px, 50vh, 480px) !important;
  max-height: 480px !important;
  min-height: 300px !important;
  border-radius: 30px !important;
  overflow: hidden !important;
  background: #efe4d8 !important;
  border: 1px solid rgba(93,67,45,0.10) !important;
  box-shadow: var(--kaw-shadow) !important;
}

body.kaw-product-route-page .kaw-main-product-media img,
body.kaw-product-route-page .kaw-main-product-img {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  object-fit: cover !important;
  object-position: center 42% !important;
  max-width: none !important;
  max-height: none !important;
}

body.kaw-product-route-page .product-page-grid,
body.kaw-product-route-page .product-detail-grid,
body.kaw-product-route-page .product-layout,
body.kaw-product-route-page .product-main-grid {
  max-width: 1180px !important;
  margin-inline: auto !important;
  display: grid !important;
  grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr) !important;
  gap: clamp(28px, 4vw, 52px) !important;
  align-items: start !important;
}

body.kaw-product-route-page .product-page-info,
body.kaw-product-route-page .product-info,
body.kaw-product-route-page .product-details,
body.kaw-product-route-page .product-info-card {
  border-radius: 30px !important;
  background:
    radial-gradient(circle at 10% 0%, rgba(201,160,92,0.11), transparent 38%),
    rgba(255,250,246,0.82) !important;
  border: 1px solid rgba(93,67,45,0.10) !important;
  box-shadow: var(--kaw-shadow) !important;
  padding: clamp(22px, 3vw, 34px) !important;
}

body.kaw-product-route-page h1,
body.kaw-product-route-page .product-title,
body.kaw-product-route-page .product-page-title {
  color: var(--kaw-espresso) !important;
  font-size: clamp(2.15rem, 4vw, 4.2rem) !important;
  line-height: 1 !important;
  letter-spacing: -0.04em !important;
}

/* Rescue product page */
#kawProductRescue {
  width: min(1180px, calc(100% - 40px));
  margin: clamp(34px, 5vw, 64px) auto 100px;
}

.kaw-rescue-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr);
  gap: clamp(28px, 4vw, 54px);
  align-items: start;
}

.kaw-rescue-media,
.kaw-rescue-info {
  border-radius: 30px;
  background:
    radial-gradient(circle at 10% 0%, rgba(201,160,92,0.11), transparent 38%),
    rgba(255,250,246,0.82);
  border: 1px solid rgba(93,67,45,0.10);
  box-shadow: var(--kaw-shadow);
}

.kaw-rescue-media {
  padding: 16px;
  overflow: hidden;
}

.kaw-rescue-img-wrap {
  height: clamp(320px, 50vh, 480px);
  border-radius: 24px;
  overflow: hidden;
  background: #efe4d8;
  position: relative;
}

.kaw-rescue-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
  display: block;
}

.kaw-rescue-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  padding: 0 15px;
  border-radius: 999px;
  background: rgba(255,250,246,0.88);
  color: var(--kaw-espresso);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 900;
}

.kaw-rescue-info {
  padding: clamp(24px, 3vw, 36px);
}

.kaw-rescue-kicker {
  color: #9b6a2f;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 900;
  margin-bottom: 14px;
}

.kaw-rescue-title {
  margin: 0 0 18px;
  color: var(--kaw-espresso);
  font-size: clamp(2.2rem, 4vw, 4.3rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.kaw-rescue-spec {
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.52);
  border: 1px solid rgba(93,67,45,0.10);
  margin-bottom: 12px;
}

.kaw-rescue-spec span {
  color: var(--kaw-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.kaw-rescue-spec strong {
  color: var(--kaw-espresso);
  font-size: 1rem;
}

.kaw-rescue-price {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 950;
  color: var(--kaw-espresso);
  margin: 20px 0;
}

.kaw-rescue-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.kaw-rescue-actions button,
.kaw-rescue-actions a {
  min-height: 50px;
  border-radius: 999px;
  padding: 0 22px;
  border: 0;
  cursor: pointer;
  font-weight: 900;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.kaw-rescue-actions button {
  background: var(--kaw-ivory);
  color: var(--kaw-espresso);
  border: 1px solid rgba(93,67,45,0.14);
}

.kaw-rescue-actions a {
  background: linear-gradient(135deg, #2d2119, #4b3324);
  color: #fffaf6;
}

/* Related products image limit */
body.kaw-product-route-page .kaw-related-stable img {
  max-height: 260px !important;
  object-fit: cover !important;
}

/* Sticky bar */
body.kaw-product-route-page #stickyWaBar,
body.kaw-product-route-page .sticky-wa-bar,
body.kaw-product-route-page .sticky-product-bar,
body.kaw-product-route-page [id*="stickyWa"],
body.kaw-product-route-page [class*="sticky-wa"] {
  position: fixed !important;
  left: 50% !important;
  right: auto !important;
  bottom: 14px !important;
  transform: translateX(-50%) !important;
  width: min(1060px, calc(100vw - 28px)) !important;
  min-height: 66px !important;
  padding: 10px 14px !important;
  border-radius: 24px !important;
  background: rgba(255,250,246,0.92) !important;
  border: 1px solid rgba(93,67,45,0.12) !important;
  box-shadow: 0 18px 44px rgba(45,33,25,0.14) !important;
  backdrop-filter: blur(16px) !important;
  z-index: 930 !important;
}

body.kaw-product-route-page #waFloatBtn,
body.kaw-product-route-page .wa-float,
body.kaw-product-route-page [aria-label*="WhatsApp"][class*="float"] {
  bottom: 84px !important;
  z-index: 940 !important;
}

@media (max-width: 860px) {
  .kaw-route-nav {
    width: min(100% - 24px, 1180px);
    min-height: 68px;
    gap: 10px;
  }

  .kaw-route-links a {
    display: none;
  }

  .kaw-route-links a:first-child,
  .kaw-route-links a:nth-child(2) {
    display: inline-flex;
    font-size: 0.68rem;
  }

  .kaw-route-brand img {
    width: 58px;
    height: 58px;
  }

  .kaw-route-action {
    width: 38px;
    height: 38px;
  }

  body.kaw-product-route-page .site-shell {
    width: min(100% - 22px, 1240px) !important;
    padding-bottom: 130px !important;
  }

  body.kaw-product-route-page .product-page-grid,
  body.kaw-product-route-page .product-detail-grid,
  body.kaw-product-route-page .product-layout,
  body.kaw-product-route-page .product-main-grid,
  .kaw-rescue-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }

  body.kaw-product-route-page .kaw-main-product-media,
  .kaw-rescue-img-wrap {
    max-width: 100% !important;
    height: min(52vh, 340px) !important;
    min-height: 260px !important;
    max-height: 340px !important;
    border-radius: 24px !important;
  }
}
CSS

cat > js/kawthar-product-route-repair.js <<'JS'
(function () {
  "use strict";

  const WA = "201034110499";
  const PRODUCT_ID = new URLSearchParams(location.search).get("id") || "";

  function isProductPage() {
    return /product\.html/i.test(location.pathname);
  }

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

  function cleanPrice(text) {
    const match = String(text || "").match(/(?:EGP|ج\.م|LE|L\.E)?\s*([\d,]+)/i);
    if (!match) return 0;
    return Number(match[1].replace(/,/g, "")) || 0;
  }

  function logoSrc() {
    const img = Array.from(document.querySelectorAll("img")).find((el) => {
      const data = [
        el.getAttribute("src") || "",
        el.getAttribute("alt") || "",
        el.className || ""
      ].join(" ").toLowerCase();
      return data.includes("logo") || data.includes("kawthar");
    });

    return img?.getAttribute("src") || "./assets/logo/kawthar-logo-hd.webp";
  }

  function snapshotFromCard(anchor) {
    const href = anchor.getAttribute("href") || "";
    if (!href.includes("product.html")) return null;

    const url = new URL(href, location.href);
    const id = url.searchParams.get("id") || "";

    const card =
      anchor.closest("article") ||
      anchor.closest("[class*='product']") ||
      anchor.closest("[class*='card']") ||
      anchor.closest("section") ||
      anchor.parentElement;

    if (!card) return null;

    const text = (card.textContent || "").replace(/\s+/g, " ").trim();
    const img = card.querySelector("img");

    const titleEl =
      card.querySelector("h1,h2,h3,h4,.product-title,[class*='title']") ||
      card.querySelector("strong,b");

    let name = titleEl ? titleEl.textContent.trim() : "";
    if (!name || /egp|new arrival|shop|view|add|check/i.test(name)) {
      const parts = text.split(/EGP|Add|Check|View|Shop|New Arrival/i).map(x => x.trim()).filter(Boolean);
      name = parts.find(x => x.length > 3 && x.length < 80) || "KAWTHAR product";
    }

    const price = cleanPrice(text);
    const image = img ? (img.currentSrc || img.src || img.getAttribute("src")) : "./assets/logo/kawthar-logo-hd.webp";

    const product = {
      id,
      productId: id,
      name,
      title: name,
      category: "Stainless Steel Anti Rust",
      material: "Premium stainless steel",
      price: price || 150,
      image,
      img: image,
      quantity: 1,
      qty: 1
    };

    return product;
  }

  function saveSnapshot(product) {
    if (!product) return;

    try {
      localStorage.setItem("kawthar_last_product", JSON.stringify(product));
      if (product.id) {
        localStorage.setItem("kawthar_product_snapshot_" + product.id, JSON.stringify(product));
      }
    } catch {}
  }

  function bindProductLinkSnapshots() {
    document.addEventListener("click", function (event) {
      const a = event.target.closest('a[href*="product.html"]');
      if (!a) return;

      const product = snapshotFromCard(a);
      saveSnapshot(product);
    }, true);
  }

  function getSnapshot() {
    const keys = [];

    if (PRODUCT_ID) keys.push("kawthar_product_snapshot_" + PRODUCT_ID);
    keys.push("kawthar_last_product");

    for (const key of keys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "null");
        if (data && typeof data === "object") return data;
      } catch {}
    }

    if (window.KawtharCart) {
      const cart = window.KawtharCart.read();
      if (cart && cart.length) return cart[0];
    }

    return null;
  }

  function hasProductNotFound() {
    return /product not found|requested product does not exist|was removed/i.test(document.body.textContent || "");
  }

  function removeOldProductNotFound() {
    const targets = Array.from(document.querySelectorAll("main, section, div, article")).filter((el) => {
      const t = (el.textContent || "").toLowerCase();
      return t.includes("product not found") && t.length < 1600;
    });

    targets.forEach((el) => el.classList.add("kaw-product-hide-old"));
  }

  function addToSelection(product) {
    const item = {
      ...product,
      quantity: 1,
      qty: 1
    };

    if (window.KawtharCart) {
      window.KawtharCart.add(item);
    } else {
      try {
        const current = JSON.parse(localStorage.getItem("kawthar_cart") || "[]");
        current.push(item);
        localStorage.setItem("kawthar_cart", JSON.stringify(current));
      } catch {}
    }

    const btn = document.getElementById("kawRescueAdd");
    if (btn) {
      btn.textContent = "Added";
      setTimeout(() => btn.textContent = "Add to selection", 1200);
    }
  }

  function whatsappUrl(product) {
    const msg = `Hi KAWTHAR, I want to ask about ${product.name || product.title || "this product"}.\n${location.href}`;
    return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  }

  function renderRescue(product) {
    if (!product || document.getElementById("kawProductRescue")) return;

    removeOldProductNotFound();

    const name = product.name || product.title || "KAWTHAR product";
    const image = product.image || product.img || "./assets/logo/kawthar-logo-hd.webp";
    const price = Number(product.price || product.salePrice || product.finalPrice || 150);
    const category = product.category || "Stainless Steel Anti Rust";
    const material = product.material || "Premium stainless steel";

    const rescue = document.createElement("section");
    rescue.id = "kawProductRescue";
    rescue.innerHTML = `
      <div class="kaw-rescue-grid">
        <div class="kaw-rescue-media">
          <div class="kaw-rescue-img-wrap">
            <img src="${esc(image)}" alt="${esc(name)}">
            <span class="kaw-rescue-badge">New Arrival</span>
          </div>
        </div>

        <div class="kaw-rescue-info">
          <div class="kaw-rescue-kicker">KAWTHAR Selection</div>
          <h1 class="kaw-rescue-title">${esc(name)}</h1>

          <div class="kaw-rescue-spec">
            <span>Category</span>
            <strong>${esc(category)}</strong>
          </div>

          <div class="kaw-rescue-spec">
            <span>Material</span>
            <strong>${esc(material)}</strong>
          </div>

          <div class="kaw-rescue-spec">
            <span>Order method</span>
            <strong>Direct inquiry via WhatsApp</strong>
          </div>

          <div class="kaw-rescue-price">${money(price)}</div>

          <div class="kaw-rescue-actions">
            <button type="button" id="kawRescueAdd">Add to selection</button>
            <a href="${whatsappUrl({ name })}" target="_blank" rel="noreferrer noopener">Check on WhatsApp</a>
          </div>
        </div>
      </div>
    `;

    const afterHeader = document.getElementById("kawProductUnifiedHeader");
    if (afterHeader) {
      afterHeader.insertAdjacentElement("afterend", rescue);
    } else {
      document.body.insertBefore(rescue, document.body.firstChild);
    }

    document.getElementById("kawRescueAdd")?.addEventListener("click", () => addToSelection(product));
  }

  function createUnifiedHeader() {
    document.querySelectorAll("#kawProductStableHeader,#kawProductFinalHeader,#kawProductUnifiedHeader").forEach(el => el.remove());

    const header = document.createElement("header");
    header.id = "kawProductUnifiedHeader";
    header.innerHTML = `
      <div class="kaw-route-ann">
        <span>
          <b>KAWTHAR</b>
          <b>STAINLESS STEEL ANTI RUST</b>
          <b>HANDMADE PREMIUM BAGS</b>
          <b>DIRECT INQUIRY VIA WHATSAPP</b>
        </span>
      </div>

      <div class="kaw-route-nav">
        <nav class="kaw-route-links" aria-label="Product navigation">
          <a href="./index.html">Home</a>
          <a href="./shop.html">Shop</a>
          <a href="./index.html#story">Story</a>
          <a href="./index.html#contact">Contact</a>
        </nav>

        <a class="kaw-route-brand" href="./index.html" aria-label="KAWTHAR home">
          <img src="${logoSrc()}" alt="KAWTHAR Logo">
        </a>

        <div class="kaw-route-actions">
          <a class="kaw-route-action" href="./shop.html" aria-label="Shop">⌕</a>
          <a class="kaw-route-action" href="./checkout.html" aria-label="Checkout">🛒</a>
          <a class="kaw-route-action" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi KAWTHAR, I want to ask about this product: " + location.href)}" target="_blank" rel="noreferrer noopener" aria-label="WhatsApp">☘</a>
        </div>
      </div>
    `;

    document.body.insertBefore(header, document.body.firstChild);
  }

  function hideDuplicateChrome() {
    const shell = document.querySelector(".site-shell");

    if (shell) {
      shell.querySelectorAll(".announcement-bar,.main-header,.site-header,header,nav").forEach((el) => {
        if (!el.closest("#kawProductUnifiedHeader")) {
          const text = (el.textContent || "").toLowerCase();
          if (
            text.includes("home") ||
            text.includes("shop") ||
            text.includes("story") ||
            text.includes("contact") ||
            text.includes("stainless steel") ||
            text.includes("direct inquiry")
          ) {
            el.classList.add("kaw-product-hide-old");
          }
        }
      });
    }

    document.querySelectorAll("button,a,[role='button']").forEach((el) => {
      if (el.closest("#kawProductUnifiedHeader")) return;
      if (String(el.getAttribute("href") || "").includes("wa.me")) return;

      const r = el.getBoundingClientRect();
      const smallLeft =
        r.left >= 0 && r.left < 130 &&
        r.top > 70 && r.top < 540 &&
        r.width >= 28 && r.width <= 82 &&
        r.height >= 28 && r.height <= 82;

      if (smallLeft) el.classList.add("kaw-product-hide-old");
    });
  }

  function isLogo(img) {
    const data = [
      img.getAttribute("src") || "",
      img.getAttribute("alt") || "",
      img.className || ""
    ].join(" ").toLowerCase();

    return data.includes("logo") || data.includes("icon") || data.includes("whatsapp");
  }

  function fixProductMedia() {
    const imgs = Array.from(document.querySelectorAll("img")).filter((img) => {
      if (isLogo(img)) return false;
      if (img.closest("#kawProductUnifiedHeader")) return false;

      const r = img.getBoundingClientRect();
      return r.width > 180 && r.height > 160;
    });

    if (!imgs.length) return;

    imgs.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (br.width * br.height - Math.max(0, br.top) * 90) - (ar.width * ar.height - Math.max(0, ar.top) * 90);
    });

    const img = imgs[0];
    img.classList.add("kaw-main-product-img");

    let node = img.parentElement;
    let best = node;

    for (let i = 0; i < 5 && node && node !== document.body; i++) {
      const text = (node.textContent || "").trim();
      const r = node.getBoundingClientRect();

      if (text.length < 280 && r.width >= 220 && r.height >= 160) best = node;

      node = node.parentElement;
    }

    if (best) best.classList.add("kaw-main-product-media");
  }

  function fixRelated() {
    Array.from(document.querySelectorAll("h1,h2,h3,.section-title")).forEach((h) => {
      const t = (h.textContent || "").toLowerCase();
      if (!t.includes("you may also like")) return;

      let node = h.parentElement;
      for (let i = 0; i < 5 && node && node !== document.body; i++) {
        node.classList.add("kaw-related-stable");
        node = node.parentElement;
        break;
      }
    });
  }

  function normalizeWhatsApp() {
    const title =
      document.querySelector("h1")?.textContent?.trim() ||
      document.querySelector(".product-title")?.textContent?.trim() ||
      "this product";

    document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"]').forEach((a) => {
      if (a.closest("#kawProductUnifiedHeader")) return;

      a.href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi KAWTHAR, I want to ask about ${title}.\n${location.href}`)}`;
      a.target = "_blank";
      a.rel = "noreferrer noopener";
    });
  }

  function runProductPage() {
    if (!isProductPage()) return;

    document.body.classList.add("kaw-product-route-page");

    createUnifiedHeader();
    hideDuplicateChrome();
    fixProductMedia();
    fixRelated();
    normalizeWhatsApp();

    if (hasProductNotFound()) {
      const snapshot = getSnapshot();
      if (snapshot) renderRescue(snapshot);
    }
  }

  bindProductLinkSnapshots();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runProductPage);
  } else {
    runProductPage();
  }

  setTimeout(runProductPage, 350);
  setTimeout(runProductPage, 1200);
  setTimeout(runProductPage, 2500);

  console.info("KAWTHAR product route repair active.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

ver = "product-route-repair-" + str(int(time.time()))
pages = ["index.html", "shop.html", "product.html", "checkout.html"]

old_product_patterns = [
    r'\s*<link rel="stylesheet" href="\./css/kawthar-product-final\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-product-final\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-product-size-fix\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-product-size-fix\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-product-stable-final\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-product-stable-final\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-product-route-repair\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-product-route-repair\.js\?v=[^"]*"></script>',
]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")

    text = text.replace("\\n</body>", "</body>")
    text = text.replace("\\n<script", "<script")

    for pat in old_product_patterns:
      text = re.sub(pat, "", text)

    if "</head>" in text:
        text = text.replace(
            "</head>",
            f'  <link rel="stylesheet" href="./css/kawthar-product-route-repair.css?v={ver}" />\n</head>',
            1
        )

    if "</body>" in text:
        text = text.replace(
            "</body>",
            f'  <script src="./js/kawthar-product-route-repair.js?v={ver}"></script>\n</body>',
            1
        )

    p.write_text(text, encoding="utf-8")

print("Product route repair linked:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-product-route-repair.js
fi

echo "=== VERIFY ==="
grep -n "kawthar-product-route-repair\|kawthar-product-stable-final\|kawthar-product-size-fix\|kawthar-product-final" index.html shop.html product.html checkout.html || true

echo "=== DONE ==="
echo "Test:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/shop.html?v=$STAMP"
echo "Then click a product from Shop."
