(function () {
  "use strict";

  if (!/product\.html/i.test(location.pathname)) return;

  const WA_NUMBER = "201034110499";

  function addProductClass() {
    document.body.classList.add("kaw-product-final-page");
    document.body.classList.add("kaw-final-ready");
  }

  function createFinalHeader() {
    if (document.getElementById("kawProductFinalHeader")) return;

    const header = document.createElement("header");
    header.id = "kawProductFinalHeader";
    header.innerHTML = `
      <div class="kaw-product-announcement" aria-label="KAWTHAR announcement">
        <span>
          <b>KAWTHAR</b>
          <b>STAINLESS STEEL ANTI RUST</b>
          <b>LUXURY FEMININE STYLING</b>
          <b>DIRECT INQUIRY VIA WHATSAPP</b>
        </span>
      </div>

      <div class="kaw-product-nav">
        <nav class="kaw-product-links" aria-label="Product page navigation">
          <a href="./index.html">Home</a>
          <a href="./shop.html">Shop</a>
          <a href="./index.html#story">Story</a>
          <a href="./index.html#contact">Contact</a>
        </nav>

        <a class="kaw-product-brand" href="./index.html" aria-label="KAWTHAR home">
          <img src="./assets/logo/kawthar-logo-hd.webp?v=logo-1782681526" alt="KAWTHAR">
        </a>

        <div class="kaw-product-actions" aria-label="Product actions">
          <a class="kaw-product-action" href="./shop.html" aria-label="Search products">⌕</a>
          <a class="kaw-product-action" href="./checkout.html" aria-label="Checkout">🛒</a>
          <a class="kaw-product-action" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi KAWTHAR, I want to ask about this product: " + location.href)}" target="_blank" rel="noreferrer noopener" aria-label="Ask on WhatsApp">☘</a>
        </div>
      </div>
    `;

    document.body.insertBefore(header, document.body.firstChild);
  }

  function hideOldProductHeader() {
    const selectors = [
      ".announcement-bar",
      ".main-header",
      ".site-header",
      ".nav-shell",
      ".nav-wrap",
      ".topbar",
      ".old-header",
      ".floating-actions",
      ".quick-actions",
      ".action-stack",
      ".side-actions",
      ".utility-stack"
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.closest("#kawProductFinalHeader")) return;
        if (el.closest(".wa-float")) return;

        const text = (el.textContent || "").toLowerCase();

        if (
          selector.includes("floating") ||
          selector.includes("quick") ||
          selector.includes("stack") ||
          selector.includes("side") ||
          text.includes("stainless steel") ||
          text.includes("home") ||
          text.includes("shop") ||
          text.includes("story") ||
          text.includes("contact")
        ) {
          el.classList.add("kaw-product-old-hidden");
        }
      });
    });
  }

  function hideLeftOldIconStack() {
    const items = Array.from(document.querySelectorAll("button, a, [role='button']"));

    items.forEach((el) => {
      if (el.closest("#kawProductFinalHeader")) return;
      if (el.closest(".wa-float")) return;
      if (el.getAttribute("href") && String(el.getAttribute("href")).includes("wa.me")) return;

      const rect = el.getBoundingClientRect();

      const looksLikeSmallFloat =
        rect.left >= 0 &&
        rect.left < 130 &&
        rect.top > 90 &&
        rect.top < 520 &&
        rect.width >= 28 &&
        rect.width <= 78 &&
        rect.height >= 28 &&
        rect.height <= 78;

      if (looksLikeSmallFloat) {
        el.classList.add("kaw-product-old-hidden");
      }
    });
  }

  function removeBlankTopSpace() {
    const possible = [
      document.querySelector("main"),
      document.querySelector(".product-page-section"),
      document.querySelector(".product-detail-section"),
      document.querySelector(".product-page"),
      document.querySelector(".product-detail")
    ].filter(Boolean);

    possible.forEach((el) => {
      el.style.marginTop = "0";
    });
  }

  function addReveal() {
    const targets = document.querySelectorAll(
      ".product-page-media, .product-gallery, .product-media, .product-page-info, .product-info, .product-details, .product-info-card, .product-actions, .product-page-actions"
    );

    targets.forEach((el, index) => {
      el.classList.add("kaw-product-reveal");
      el.style.transitionDelay = `${Math.min(index, 5) * 80}ms`;
    });

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".kaw-product-reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10 });

    document.querySelectorAll(".kaw-product-reveal").forEach((el) => io.observe(el));
  }

  function normalizeWhatsappProductLinks() {
    const title =
      document.querySelector("h1")?.textContent?.trim() ||
      document.querySelector(".product-title")?.textContent?.trim() ||
      "this product";

    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach((a) => {
      if (a.closest("#kawProductFinalHeader")) return;
      const msg = `Hi KAWTHAR, I want to ask about ${title}.\n${location.href}`;
      a.setAttribute("href", `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noreferrer noopener");
    });
  }

  function fixProductImageAlt() {
    const title =
      document.querySelector("h1")?.textContent?.trim() ||
      document.querySelector(".product-title")?.textContent?.trim() ||
      "KAWTHAR product";

    document.querySelectorAll("img").forEach((img) => {
      if (!img.getAttribute("alt")) {
        img.setAttribute("alt", title);
      }
    });
  }

  function unlockPage() {
    document.querySelectorAll("#splashScreen,.splash-screen,#goStartup,.go-startup").forEach((el) => {
      el.remove();
    });

    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
    document.body.style.opacity = "1";
    document.body.style.visibility = "visible";
  }

  function run() {
    addProductClass();
    createFinalHeader();
    hideOldProductHeader();
    hideLeftOldIconStack();
    removeBlankTopSpace();
    addReveal();
    normalizeWhatsappProductLinks();
    fixProductImageAlt();
    unlockPage();

    console.info("KAWTHAR product finalizer applied.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 400);
  setTimeout(run, 1200);
  setTimeout(() => {
    hideOldProductHeader();
    hideLeftOldIconStack();
    unlockPage();
  }, 2200);
})();
