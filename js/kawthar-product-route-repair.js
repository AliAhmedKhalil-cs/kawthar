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
