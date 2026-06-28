#!/usr/bin/env bash
set -e

echo "=== KAWTHAR PRODUCT PAGE FINALIZER ==="

STAMP="$(date +%F-%H%M%S)"

mkdir -p backups css js

tar -czf "backups/backup-before-product-final-$STAMP.tar.gz" product.html css js 2>/dev/null || true

echo "Backup created: backups/backup-before-product-final-$STAMP.tar.gz"

cat > css/kawthar-product-final.css <<'CSS'
/* =========================================================
   KAWTHAR PRODUCT PAGE FINALIZER
   Fixes old product page header / floating icons / spacing.
   Keeps logo, colors, product data, cart logic, and identity.
   ========================================================= */

:root {
  --kaw-espresso: #2d2119;
  --kaw-brown: #4b3829;
  --kaw-soft-brown: #6f5a47;
  --kaw-gold: #c9a05c;
  --kaw-cream: #f5ede4;
  --kaw-ivory: #fffaf6;
  --kaw-stroke: rgba(93, 67, 45, 0.12);
  --kaw-shadow: 0 22px 60px rgba(45, 33, 25, 0.10);
}

html,
body {
  overflow-x: hidden !important;
}

body.kaw-product-final-page {
  background:
    radial-gradient(circle at 12% 10%, rgba(201,160,92,0.11), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(255,250,246,0.72), transparent 28%),
    linear-gradient(180deg, #f7efe7 0%, #efe4d8 100%) !important;
  color: var(--kaw-espresso) !important;
}

/* Hide old product header/announcement/side action stacks only on product page */
body.kaw-product-final-page .kaw-product-old-hidden,
body.kaw-product-final-page .announcement-bar.kaw-product-old-hidden,
body.kaw-product-final-page .main-header.kaw-product-old-hidden,
body.kaw-product-final-page .site-header.kaw-product-old-hidden,
body.kaw-product-final-page .nav-shell.kaw-product-old-hidden,
body.kaw-product-final-page .floating-actions.kaw-product-old-hidden,
body.kaw-product-final-page .quick-actions.kaw-product-old-hidden,
body.kaw-product-final-page .action-stack.kaw-product-old-hidden,
body.kaw-product-final-page .side-actions.kaw-product-old-hidden {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* New product header */
#kawProductFinalHeader {
  position: sticky;
  top: 0;
  z-index: 999;
  width: 100%;
  background: rgba(255, 250, 246, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(93, 67, 45, 0.10);
  box-shadow: 0 12px 34px rgba(45, 33, 25, 0.04);
}

.kaw-product-announcement {
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1d120b;
  color: #f4d990;
  overflow: hidden;
  white-space: nowrap;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 800;
}

.kaw-product-announcement span {
  display: inline-flex;
  gap: 28px;
  align-items: center;
}

.kaw-product-nav {
  min-height: 78px;
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
}

.kaw-product-links {
  display: flex;
  align-items: center;
  gap: clamp(18px, 2.2vw, 32px);
}

.kaw-product-links a {
  color: var(--kaw-espresso);
  text-decoration: none;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 850;
  position: relative;
}

.kaw-product-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -9px;
  width: 0;
  height: 1px;
  background: var(--kaw-gold);
  transition: width 220ms ease;
}

.kaw-product-links a:hover::after,
.kaw-product-links a.is-active::after {
  width: 100%;
}

.kaw-product-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.kaw-product-brand img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  opacity: 0.90;
  filter: drop-shadow(0 12px 20px rgba(45, 33, 25, 0.08));
}

.kaw-product-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.kaw-product-action {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(93, 67, 45, 0.10);
  background: rgba(255, 250, 246, 0.86);
  color: var(--kaw-espresso);
  display: grid;
  place-items: center;
  text-decoration: none;
  font-size: 1rem;
  box-shadow: 0 8px 22px rgba(45, 33, 25, 0.06);
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.kaw-product-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(45, 33, 25, 0.10);
}

/* Remove the huge empty old top zone */
body.kaw-product-final-page main,
body.kaw-product-final-page .site-shell,
body.kaw-product-final-page .product-page,
body.kaw-product-final-page .product-page-section,
body.kaw-product-final-page .product-detail,
body.kaw-product-final-page .product-detail-page {
  margin-top: 0 !important;
}

body.kaw-product-final-page main {
  min-height: auto !important;
}

/* Product page cinematic layout polish */
body.kaw-product-final-page .product-page-section,
body.kaw-product-final-page .product-detail-section,
body.kaw-product-final-page .product-page,
body.kaw-product-final-page .product-detail {
  position: relative !important;
  padding-top: clamp(46px, 6vw, 82px) !important;
  padding-bottom: clamp(70px, 8vw, 110px) !important;
  isolation: isolate;
}

body.kaw-product-final-page .product-page-section::before,
body.kaw-product-final-page .product-detail-section::before,
body.kaw-product-final-page .product-page::before {
  content: "";
  position: absolute;
  width: min(46vw, 540px);
  height: min(46vw, 540px);
  right: -12%;
  top: 2%;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(201,160,92,0.12), transparent 68%);
  filter: blur(10px);
  pointer-events: none;
  z-index: 0;
}

body.kaw-product-final-page .container,
body.kaw-product-final-page .product-container {
  position: relative;
  z-index: 2;
}

/* Known product layout classes */
body.kaw-product-final-page .product-page-grid,
body.kaw-product-final-page .product-detail-grid,
body.kaw-product-final-page .product-layout,
body.kaw-product-final-page .product-main-grid {
  display: grid !important;
  grid-template-columns: minmax(0, 0.95fr) minmax(380px, 1.05fr) !important;
  gap: clamp(28px, 4vw, 56px) !important;
  align-items: start !important;
}

/* Product media cards */
body.kaw-product-final-page .product-page-media,
body.kaw-product-final-page .product-gallery,
body.kaw-product-final-page .product-media,
body.kaw-product-final-page .product-image-card {
  border-radius: 32px !important;
  padding: clamp(14px, 2vw, 18px) !important;
  background: rgba(255, 250, 246, 0.78) !important;
  border: 1px solid rgba(93, 67, 45, 0.10) !important;
  box-shadow: var(--kaw-shadow) !important;
  overflow: hidden !important;
}

body.kaw-product-final-page .product-page-image-wrap,
body.kaw-product-final-page .product-image-wrap,
body.kaw-product-final-page .product-main-image,
body.kaw-product-final-page .product-gallery-main {
  border-radius: 24px !important;
  overflow: hidden !important;
  aspect-ratio: 1 / 1.08 !important;
  background: #efe4d8 !important;
}

body.kaw-product-final-page .product-page-image-wrap img,
body.kaw-product-final-page .product-image-wrap img,
body.kaw-product-final-page .product-main-image img,
body.kaw-product-final-page .product-gallery-main img,
body.kaw-product-final-page .product-page-media img,
body.kaw-product-final-page .product-gallery img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
  transition: transform 900ms cubic-bezier(.2,.8,.2,1), filter 700ms ease !important;
}

body.kaw-product-final-page .product-page-media:hover img,
body.kaw-product-final-page .product-gallery:hover img {
  transform: scale(1.025);
  filter: saturate(1.02) contrast(1.02);
}

/* Product info card */
body.kaw-product-final-page .product-page-info,
body.kaw-product-final-page .product-info,
body.kaw-product-final-page .product-details,
body.kaw-product-final-page .product-info-card {
  border-radius: 32px !important;
  background:
    radial-gradient(circle at 10% 0%, rgba(201,160,92,0.12), transparent 38%),
    rgba(255, 250, 246, 0.82) !important;
  border: 1px solid rgba(93, 67, 45, 0.10) !important;
  box-shadow: var(--kaw-shadow) !important;
  padding: clamp(24px, 3.2vw, 36px) !important;
}

body.kaw-product-final-page h1,
body.kaw-product-final-page .product-title,
body.kaw-product-final-page .product-page-title {
  color: var(--kaw-espresso) !important;
  font-size: clamp(2.4rem, 4.4vw, 4.8rem) !important;
  line-height: 0.98 !important;
  letter-spacing: -0.04em !important;
}

body.kaw-product-final-page .product-kicker,
body.kaw-product-final-page .product-label,
body.kaw-product-final-page .eyebrow,
body.kaw-product-final-page [class*="kicker"] {
  color: #9b6a2f !important;
  letter-spacing: 0.16em !important;
  text-transform: uppercase !important;
  font-weight: 850 !important;
}

body.kaw-product-final-page .product-price,
body.kaw-product-final-page [class*="price"] {
  color: var(--kaw-espresso) !important;
  font-weight: 900 !important;
}

/* Product spec boxes */
body.kaw-product-final-page .product-spec,
body.kaw-product-final-page .product-detail-row,
body.kaw-product-final-page .detail-box,
body.kaw-product-final-page .info-box,
body.kaw-product-final-page [class*="spec"] {
  border-radius: 20px !important;
  background: rgba(255,255,255,0.48) !important;
  border: 1px solid rgba(93,67,45,0.10) !important;
}

/* CTA buttons */
body.kaw-product-final-page .product-actions,
body.kaw-product-final-page .product-page-actions {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 12px !important;
}

body.kaw-product-final-page .product-actions a,
body.kaw-product-final-page .product-actions button,
body.kaw-product-final-page .product-page-actions a,
body.kaw-product-final-page .product-page-actions button,
body.kaw-product-final-page .btn {
  border-radius: 999px !important;
  min-height: 48px !important;
  padding-inline: 20px !important;
  font-weight: 900 !important;
  letter-spacing: 0.06em !important;
  transition: transform 220ms ease, box-shadow 220ms ease !important;
}

body.kaw-product-final-page .product-actions a:hover,
body.kaw-product-final-page .product-actions button:hover,
body.kaw-product-final-page .product-page-actions a:hover,
body.kaw-product-final-page .product-page-actions button:hover,
body.kaw-product-final-page .btn:hover {
  transform: translateY(-2px) !important;
}

/* Keep WhatsApp floating button only */
body.kaw-product-final-page .wa-float,
body.kaw-product-final-page [aria-label*="WhatsApp"],
body.kaw-product-final-page [aria-label*="whatsapp"] {
  z-index: 998 !important;
}

/* Product page final reveal */
body.kaw-product-final-page .kaw-product-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 700ms ease, transform 700ms cubic-bezier(.2,.8,.2,1);
}

body.kaw-product-final-page .kaw-product-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Mobile */
@media (max-width: 860px) {
  .kaw-product-announcement {
    font-size: 0.62rem;
    justify-content: flex-start;
    padding-inline: 14px;
  }

  .kaw-product-nav {
    width: min(100% - 24px, 1180px);
    min-height: 70px;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
  }

  .kaw-product-links {
    gap: 12px;
  }

  .kaw-product-links a {
    display: none;
  }

  .kaw-product-links a:first-child,
  .kaw-product-links a:nth-child(2) {
    display: inline-flex;
    font-size: 0.7rem;
  }

  .kaw-product-brand img {
    width: 58px;
    height: 58px;
  }

  .kaw-product-actions {
    gap: 7px;
  }

  .kaw-product-action {
    width: 38px;
    height: 38px;
    font-size: 0.92rem;
  }

  body.kaw-product-final-page .product-page-grid,
  body.kaw-product-final-page .product-detail-grid,
  body.kaw-product-final-page .product-layout,
  body.kaw-product-final-page .product-main-grid {
    grid-template-columns: 1fr !important;
    gap: 22px !important;
  }

  body.kaw-product-final-page .product-page-section,
  body.kaw-product-final-page .product-detail-section,
  body.kaw-product-final-page .product-page,
  body.kaw-product-final-page .product-detail {
    padding-top: 30px !important;
  }

  body.kaw-product-final-page .product-page-image-wrap,
  body.kaw-product-final-page .product-image-wrap,
  body.kaw-product-final-page .product-main-image,
  body.kaw-product-final-page .product-gallery-main {
    aspect-ratio: 1 / 1 !important;
    max-height: 420px !important;
  }

  body.kaw-product-final-page h1,
  body.kaw-product-final-page .product-title,
  body.kaw-product-final-page .product-page-title {
    font-size: clamp(2.1rem, 10vw, 3.2rem) !important;
  }
}

@media (max-width: 520px) {
  .kaw-product-links a:nth-child(2) {
    display: none;
  }

  .kaw-product-action:nth-child(2) {
    display: none;
  }

  body.kaw-product-final-page .product-page-info,
  body.kaw-product-final-page .product-info,
  body.kaw-product-final-page .product-details,
  body.kaw-product-final-page .product-info-card,
  body.kaw-product-final-page .product-page-media,
  body.kaw-product-final-page .product-gallery,
  body.kaw-product-final-page .product-media {
    border-radius: 24px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  body.kaw-product-final-page *,
  body.kaw-product-final-page *::before,
  body.kaw-product-final-page *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }

  body.kaw-product-final-page .kaw-product-reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
CSS

cat > js/kawthar-product-final.js <<'JS'
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
          <img src="./assets/logo/kawthar-logo-hd.webp" alt="KAWTHAR">
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
JS

python3 - <<'PY'
from pathlib import Path
import re, time

p = Path("product.html")
if not p.exists():
    raise SystemExit("ERROR: product.html not found")

text = p.read_text(encoding="utf-8")
ver = str(int(time.time()))

text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-product-final\.css\?v=[^"]*" />', '', text)
text = re.sub(r'\s*<script src="\./js/kawthar-product-final\.js\?v=[^"]*"></script>', '', text)

if "</head>" not in text or "</body>" not in text:
    raise SystemExit("ERROR: product.html missing </head> or </body>")

text = text.replace(
    "</head>",
    f'  <link rel="stylesheet" href="./css/kawthar-product-final.css?v={ver}" />\n</head>',
    1
)

text = text.replace(
    "</body>",
    f'  <script src="./js/kawthar-product-final.js?v={ver}"></script>\n</body>',
    1
)

p.write_text(text, encoding="utf-8")

print("Product final CSS/JS linked successfully.")
print(f"Version: {ver}")
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-product-final.js
fi

echo "=== DONE ==="
echo "Test product page with:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/product.html?id=1774967141418&v=product-final-$STAMP"
