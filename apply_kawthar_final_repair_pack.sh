#!/usr/bin/env bash
set -e

echo "=== KAWTHAR FINAL REPAIR PACK ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-final-repair-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js assets 2>/dev/null || true

echo "Backup created: backups/backup-before-final-repair-$STAMP.tar.gz"

cat > css/kawthar-product-stable-final.css <<'CSS'
/* =========================================================
   KAWTHAR PRODUCT STABLE FINAL
   Repairs product page layout without touching product data.
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

body.kaw-product-stable {
  background:
    radial-gradient(circle at 12% 9%, rgba(201,160,92,0.10), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(255,250,246,0.72), transparent 28%),
    linear-gradient(180deg, #f7efe7 0%, #efe4d8 100%) !important;
  overflow-x: hidden !important;
  color: var(--kaw-espresso) !important;
}

/* Hide old random product chrome */
body.kaw-product-stable .kaw-old-product-chrome,
body.kaw-product-stable .kaw-old-side-actions {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* New stable product header */
#kawProductStableHeader {
  position: sticky;
  top: 0;
  z-index: 999;
  background: rgba(255,250,246,0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(93,67,45,0.10);
  box-shadow: 0 12px 34px rgba(45,33,25,0.045);
}

.kaw-stable-ann {
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

.kaw-stable-ann span {
  display: inline-flex;
  gap: 28px;
  align-items: center;
}

.kaw-stable-nav {
  min-height: 76px;
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
}

.kaw-stable-links {
  display: flex;
  gap: clamp(18px, 2.4vw, 32px);
  align-items: center;
}

.kaw-stable-links a {
  color: var(--kaw-espresso);
  text-decoration: none;
  font-size: 0.76rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 900;
}

.kaw-stable-brand img {
  width: 68px;
  height: 68px;
  object-fit: contain;
  opacity: 0.92;
  filter: drop-shadow(0 12px 20px rgba(45,33,25,0.08));
}

.kaw-stable-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
}

.kaw-stable-action {
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

/* Product content compact sizing */
body.kaw-product-stable .site-shell {
  width: min(1240px, calc(100% - 40px)) !important;
  margin-inline: auto !important;
  padding: clamp(28px, 4vw, 52px) 0 120px !important;
}

body.kaw-product-stable main,
body.kaw-product-stable .product-page,
body.kaw-product-stable .product-detail,
body.kaw-product-stable .product-page-section,
body.kaw-product-stable .product-detail-section {
  margin-top: 0 !important;
  padding-top: clamp(18px, 3vw, 36px) !important;
}

body.kaw-product-stable .kaw-main-product-media {
  width: 100% !important;
  max-width: 580px !important;
  height: clamp(340px, 52vh, 500px) !important;
  max-height: 500px !important;
  min-height: 320px !important;
  border-radius: 30px !important;
  overflow: hidden !important;
  background: #efe4d8 !important;
  border: 1px solid rgba(93,67,45,0.10) !important;
  box-shadow: var(--kaw-shadow) !important;
}

body.kaw-product-stable .kaw-main-product-media img,
body.kaw-product-stable .kaw-main-product-img {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  object-fit: cover !important;
  object-position: center 42% !important;
  max-width: none !important;
  max-height: none !important;
}

/* Product cards/info */
body.kaw-product-stable .product-page-grid,
body.kaw-product-stable .product-detail-grid,
body.kaw-product-stable .product-layout,
body.kaw-product-stable .product-main-grid {
  max-width: 1180px !important;
  margin-inline: auto !important;
  display: grid !important;
  grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr) !important;
  gap: clamp(28px, 4vw, 52px) !important;
  align-items: start !important;
}

body.kaw-product-stable .product-page-info,
body.kaw-product-stable .product-info,
body.kaw-product-stable .product-details,
body.kaw-product-stable .product-info-card {
  border-radius: 30px !important;
  background:
    radial-gradient(circle at 10% 0%, rgba(201,160,92,0.11), transparent 38%),
    rgba(255,250,246,0.82) !important;
  border: 1px solid rgba(93,67,45,0.10) !important;
  box-shadow: var(--kaw-shadow) !important;
  padding: clamp(22px, 3vw, 34px) !important;
}

body.kaw-product-stable h1,
body.kaw-product-stable .product-title,
body.kaw-product-stable .product-page-title {
  color: var(--kaw-espresso) !important;
  font-size: clamp(2.15rem, 4vw, 4.2rem) !important;
  line-height: 1 !important;
  letter-spacing: -0.04em !important;
}

/* Related selections fix */
body.kaw-product-stable .kaw-related-stable {
  max-width: 1180px !important;
  margin: 52px auto 0 !important;
}

body.kaw-product-stable .kaw-related-stable h2,
body.kaw-product-stable .kaw-related-stable .section-title {
  font-size: clamp(2rem, 4vw, 3.6rem) !important;
  line-height: 1.02 !important;
  margin-bottom: 22px !important;
}

body.kaw-product-stable .kaw-related-stable .product-card,
body.kaw-product-stable .kaw-related-stable article,
body.kaw-product-stable .kaw-related-stable [class*="product"] {
  max-width: 360px !important;
}

body.kaw-product-stable .kaw-related-stable img {
  max-height: 260px !important;
  object-fit: cover !important;
  border-radius: 22px !important;
}

/* Sticky bottom product bar */
body.kaw-product-stable #stickyWaBar,
body.kaw-product-stable .sticky-wa-bar,
body.kaw-product-stable .sticky-product-bar,
body.kaw-product-stable [id*="stickyWa"],
body.kaw-product-stable [class*="sticky-wa"] {
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

body.kaw-product-stable #waFloatBtn,
body.kaw-product-stable .wa-float,
body.kaw-product-stable [aria-label*="WhatsApp"][class*="float"] {
  bottom: 84px !important;
  z-index: 940 !important;
}

/* Social proof toast */
body.kaw-product-stable .sp-toast,
body.kaw-product-stable #spToastWrap,
body.kaw-product-stable [class*="toast"] {
  max-width: min(300px, calc(100vw - 32px)) !important;
  z-index: 850 !important;
}

/* Mobile */
@media (max-width: 860px) {
  .kaw-stable-nav {
    width: min(100% - 24px, 1180px);
    min-height: 68px;
    gap: 10px;
  }

  .kaw-stable-links a {
    display: none;
  }

  .kaw-stable-links a:first-child,
  .kaw-stable-links a:nth-child(2) {
    display: inline-flex;
    font-size: 0.68rem;
  }

  .kaw-stable-brand img {
    width: 58px;
    height: 58px;
  }

  .kaw-stable-action {
    width: 38px;
    height: 38px;
  }

  body.kaw-product-stable .site-shell {
    width: min(100% - 22px, 1240px) !important;
    padding-bottom: 130px !important;
  }

  body.kaw-product-stable .product-page-grid,
  body.kaw-product-stable .product-detail-grid,
  body.kaw-product-stable .product-layout,
  body.kaw-product-stable .product-main-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }

  body.kaw-product-stable .kaw-main-product-media {
    max-width: 100% !important;
    height: min(52vh, 340px) !important;
    min-height: 260px !important;
    max-height: 340px !important;
    border-radius: 24px !important;
  }

  body.kaw-product-stable .sp-toast,
  body.kaw-product-stable #spToastWrap,
  body.kaw-product-stable [class*="toast"] {
    display: none !important;
  }
}

@media (max-width: 520px) {
  .kaw-stable-links a:nth-child(2),
  .kaw-stable-action:first-child {
    display: none;
  }
}
CSS

cat > js/kawthar-product-stable-final.js <<'JS'
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
JS

cat > css/kawthar-footer-social-final.css <<'CSS'
/* =========================================================
   KAWTHAR FOOTER SOCIAL FINAL
   Instagram + Facebook + WhatsApp visual chips.
   ========================================================= */

.kaw-footer-social-final {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.kaw-footer-social-chip {
  display: inline-flex !important;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 8px 13px;
  border-radius: 999px;
  text-decoration: none !important;
  background: rgba(255,250,246,0.78);
  border: 1px solid rgba(93,67,45,0.10);
  color: #3f2e22 !important;
  box-shadow: 0 12px 26px rgba(45,33,25,0.08);
  transition: transform .22s ease, box-shadow .22s ease;
}

.kaw-footer-social-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(45,33,25,0.12);
}

.kaw-footer-social-icon {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #fff;
  font-weight: 900;
  font-size: 0.88rem;
}

.kaw-footer-social-chip.is-whatsapp .kaw-footer-social-icon {
  background: #25d366;
}

.kaw-footer-social-chip.is-instagram .kaw-footer-social-icon {
  background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 55%, #fcb045 100%);
}

.kaw-footer-social-chip.is-facebook .kaw-footer-social-icon {
  background: #1877f2;
}

.kaw-footer-social-text {
  display: grid;
  gap: 1px;
}

.kaw-footer-social-text strong {
  color: #2d2119 !important;
  font-size: 0.84rem;
  line-height: 1.1;
}

.kaw-footer-social-text span {
  color: #6f5a47 !important;
  font-size: 0.68rem;
  line-height: 1.1;
}

@media (max-width: 640px) {
  .kaw-footer-social-final {
    flex-direction: column;
    align-items: flex-start;
  }
}
CSS

cat > js/kawthar-footer-social-final.js <<'JS'
(function () {
  "use strict";

  const WA = "201034110499";
  const IG = "https://www.instagram.com/kawthareg_/";
  const FB = "https://www.facebook.com/groups/1123525308506342/";

  function updateLinks() {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const text = (a.textContent || "").toLowerCase();

      if (href.includes("instagram.com") || text.includes("instagram")) {
        a.href = IG;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("facebook.com") || text.includes("facebook")) {
        a.href = FB;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("wa.me") || href.includes("whatsapp") || text.includes("whatsapp")) {
        const msg = "Hi KAWTHAR, I would like to ask about your products.";
        a.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }
    });
  }

  function updateFooterText() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.innerHTML = footer.innerHTML
      .replace(/Online payment gateway is being prepared for card and wallet payments\./gi, "Manual payment via InstaPay. Confirmation is completed on WhatsApp after the transfer screenshot.")
      .replace(/Card payment soon/gi, "InstaPay confirmation")
      .replace(/Mobile wallet soon/gi, "WhatsApp support");
  }

  function injectFooterSocial() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    if (footer.querySelector(".kaw-footer-social-final")) return;

    const target =
      Array.from(footer.querySelectorAll("div, section, nav, ul"))
        .find((el) => (el.textContent || "").toLowerCase().includes("contact")) ||
      footer;

    const box = document.createElement("div");
    box.className = "kaw-footer-social-final";
    box.innerHTML = `
      <a class="kaw-footer-social-chip is-whatsapp" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi KAWTHAR, I would like to ask about your products.")}" target="_blank" rel="noreferrer noopener">
        <span class="kaw-footer-social-icon">W</span>
        <span class="kaw-footer-social-text"><strong>WhatsApp</strong><span>Direct inquiry</span></span>
      </a>

      <a class="kaw-footer-social-chip is-instagram" href="${IG}" target="_blank" rel="noreferrer noopener">
        <span class="kaw-footer-social-icon">IG</span>
        <span class="kaw-footer-social-text"><strong>Instagram</strong><span>@kawthareg_</span></span>
      </a>

      <a class="kaw-footer-social-chip is-facebook" href="${FB}" target="_blank" rel="noreferrer noopener">
        <span class="kaw-footer-social-icon">f</span>
        <span class="kaw-footer-social-text"><strong>Facebook</strong><span>KAWTHAR group</span></span>
      </a>
    `;

    target.appendChild(box);
  }

  function run() {
    updateFooterText();
    updateLinks();
    injectFooterSocial();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 500);
  setTimeout(run, 1500);

  console.info("KAWTHAR footer social final active.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

ver = "repair-" + str(int(time.time()))
pages = ["index.html", "shop.html", "product.html", "checkout.html"]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")

    # Clean bad visible literal newlines if they were injected before
    text = text.replace("\\n</body>", "</body>")
    text = text.replace("\\n<script", "<script")

    # Replace social URLs
    text = re.sub(r'https?://(?:www\.)?instagram\.com/[^"\'\s<>()]+/?', 'https://www.instagram.com/kawthareg_/', text, flags=re.I)
    text = re.sub(r'https?://(?:www\.)?facebook\.com/groups/1123525308506342[^"\'\s<>()]*', 'https://www.facebook.com/groups/1123525308506342/', text, flags=re.I)

    # Remove older social upgrade to avoid duplicate icon systems
    text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-social-upgrade\.css\?v=[^"]*" />', '', text)
    text = re.sub(r'\s*<script src="\./js/kawthar-social-upgrade\.js\?v=[^"]*"></script>', '', text)

    # Link footer social final
    text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-footer-social-final\.css\?v=[^"]*" />', '', text)
    text = re.sub(r'\s*<script src="\./js/kawthar-footer-social-final\.js\?v=[^"]*"></script>', '', text)

    if "</head>" in text:
      text = text.replace("</head>", f'  <link rel="stylesheet" href="./css/kawthar-footer-social-final.css?v={ver}" />\n</head>', 1)

    if "</body>" in text:
      text = text.replace("</body>", f'  <script src="./js/kawthar-footer-social-final.js?v={ver}"></script>\n</body>', 1)

    p.write_text(text, encoding="utf-8")

p = Path("product.html")
text = p.read_text(encoding="utf-8", errors="ignore")

# Remove previous product repair files that conflict
patterns = [
    r'\s*<link rel="stylesheet" href="\./css/kawthar-product-final\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-product-final\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-product-size-fix\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-product-size-fix\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-product-stable-final\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-product-stable-final\.js\?v=[^"]*"></script>',
]

for pat in patterns:
    text = re.sub(pat, '', text)

if "</head>" in text:
    text = text.replace("</head>", f'  <link rel="stylesheet" href="./css/kawthar-product-stable-final.css?v={ver}" />\n</head>', 1)

if "</body>" in text:
    text = text.replace("</body>", f'  <script src="./js/kawthar-product-stable-final.js?v={ver}"></script>\n</body>', 1)

p.write_text(text, encoding="utf-8")

print("Final repair pack linked:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-product-stable-final.js
  node --check js/kawthar-footer-social-final.js
fi

echo "=== VERIFY LINKS ==="
grep -n "kawthar-product-stable-final\|kawthar-footer-social-final" product.html index.html shop.html checkout.html | head -80 || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/product.html?id=1774967141418&v=$STAMP"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/index.html?v=$STAMP"
