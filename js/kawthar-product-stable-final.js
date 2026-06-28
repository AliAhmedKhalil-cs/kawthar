(function () {
  "use strict";

  if (!/product\.html/i.test(location.pathname)) return;

  const WA = "201034110499";

  function logoSrc() {
    const imgs = Array.from(document.querySelectorAll("img"));
    const logo = imgs.find((img) => {
      const data = [
        img.getAttribute("src") || "",
        img.getAttribute("alt") || "",
        img.className || ""
      ].join(" ").toLowerCase();
      return data.includes("logo") || data.includes("kawthar");
    });

    return logo?.getAttribute("src") || "./assets/logo/kawthar-logo-hd.webp";
  }

  function makeHeader() {
    if (document.getElementById("kawProductStableHeader")) return;

    const header = document.createElement("header");
    header.id = "kawProductStableHeader";
    header.innerHTML = `
      <div class="kaw-stable-ann">
        <span>
          <b>KAWTHAR</b>
          <b>STAINLESS STEEL ANTI RUST</b>
          <b>HANDMADE PREMIUM BAGS</b>
          <b>DIRECT INQUIRY VIA WHATSAPP</b>
        </span>
      </div>

      <div class="kaw-stable-nav">
        <nav class="kaw-stable-links" aria-label="Product navigation">
          <a href="./index.html">Home</a>
          <a href="./shop.html">Shop</a>
          <a href="./index.html#story">Story</a>
          <a href="./index.html#contact">Contact</a>
        </nav>

        <a class="kaw-stable-brand" href="./index.html" aria-label="KAWTHAR home">
          <img src="${logoSrc()}" alt="KAWTHAR Logo">
        </a>

        <div class="kaw-stable-actions">
          <a class="kaw-stable-action" href="./shop.html" aria-label="Shop">⌕</a>
          <a class="kaw-stable-action" href="./checkout.html" aria-label="Checkout">🛒</a>
          <a class="kaw-stable-action" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi KAWTHAR, I want to ask about this product: " + location.href)}" target="_blank" rel="noreferrer noopener" aria-label="WhatsApp">☘</a>
        </div>
      </div>
    `;

    document.body.insertBefore(header, document.body.firstChild);
  }

  function hideOldChrome() {
    const candidates = Array.from(document.body.children).slice(0, 8);

    candidates.forEach((el) => {
      if (el.id === "kawProductStableHeader") return;
      if (el.tagName === "SCRIPT" || el.tagName === "STYLE") return;

      const text = (el.textContent || "").replace(/\s+/g, " ").toLowerCase();
      const rect = el.getBoundingClientRect();

      if (
        rect.height > 40 &&
        rect.height < 360 &&
        (
          text.includes("home shop story contact") ||
          text.includes("stainless steel anti rust") ||
          text.includes("direct inquiry via whatsapp")
        )
      ) {
        el.classList.add("kaw-old-product-chrome");
      }
    });

    document.querySelectorAll("button, a, [role='button']").forEach((el) => {
      if (el.closest("#kawProductStableHeader")) return;
      if (String(el.getAttribute("href") || "").includes("wa.me")) return;

      const r = el.getBoundingClientRect();
      const smallLeft =
        r.left >= 0 && r.left < 130 &&
        r.top > 70 && r.top < 520 &&
        r.width >= 28 && r.width <= 82 &&
        r.height >= 28 && r.height <= 82;

      if (smallLeft) el.classList.add("kaw-old-side-actions");
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

  function selectMainImage() {
    const imgs = Array.from(document.querySelectorAll("img")).filter((img) => {
      if (isLogo(img)) return false;

      const r = img.getBoundingClientRect();
      return r.width > 180 && r.height > 160;
    });

    if (!imgs.length) return null;

    imgs.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();

      // Prefer images nearer to the top product section, not related products lower down.
      const aScore = ar.width * ar.height - Math.max(0, ar.top) * 80;
      const bScore = br.width * br.height - Math.max(0, br.top) * 80;

      return bScore - aScore;
    });

    return imgs[0];
  }

  function bestWrapper(img) {
    let node = img?.parentElement;
    let best = node;

    for (let i = 0; i < 5 && node && node !== document.body; i++) {
      const text = (node.textContent || "").trim();
      const r = node.getBoundingClientRect();

      if (text.length < 260 && r.width >= 220 && r.height >= 160) {
        best = node;
      }

      node = node.parentElement;
    }

    return best;
  }

  function fixMainMedia() {
    const img = selectMainImage();
    if (!img) return;

    img.classList.add("kaw-main-product-img");

    const wrap = bestWrapper(img);
    if (wrap) wrap.classList.add("kaw-main-product-media");
  }

  function fixRelatedSection() {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,.section-title"))
      .filter((el) => (el.textContent || "").toLowerCase().includes("you may also like"));

    headings.forEach((h) => {
      let node = h;
      for (let i = 0; i < 5 && node && node !== document.body; i++) {
        const text = (node.textContent || "").toLowerCase();
        if (text.includes("you may also like")) {
          node.classList.add("kaw-related-stable");
          break;
        }
        node = node.parentElement;
      }
    });
  }

  function normalizeWhatsApp() {
    const title =
      document.querySelector("h1")?.textContent?.trim() ||
      document.querySelector(".product-title")?.textContent?.trim() ||
      "this product";

    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach((a) => {
      if (a.closest("#kawProductStableHeader")) return;

      const msg = `Hi KAWTHAR, I want to ask about ${title}.\n${location.href}`;
      a.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
      a.target = "_blank";
      a.rel = "noreferrer noopener";
    });
  }

  function run() {
    document.body.classList.add("kaw-product-stable");
    makeHeader();
    hideOldChrome();
    fixMainMedia();
    fixRelatedSection();
    normalizeWhatsApp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 300);
  setTimeout(run, 1000);
  setTimeout(run, 2200);

  console.info("KAWTHAR product stable final active.");
})();
