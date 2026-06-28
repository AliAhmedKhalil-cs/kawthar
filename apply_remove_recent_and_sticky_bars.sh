#!/usr/bin/env bash
set -e

echo "=== KAWTHAR REMOVE RECENTLY VIEWED + OLD STICKY PRODUCT BAR ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-remove-obstructions-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

cat > css/kawthar-remove-obstructions.css <<'CSS'
/* =========================================================
   KAWTHAR REMOVE OBSTRUCTIONS
   Removes recently viewed strip and old sticky product CTA bar.
   Safe visual cleanup only.
   ========================================================= */

/* Recently viewed strip/cards */
#recentlyViewed,
#recentlyViewedWrap,
#recentlyViewedBar,
#recentProducts,
#recentlyProducts,
.recently-viewed,
.recentlyViewed,
.recently-products,
.recent-products,
.viewed-products,
.rv-strip,
.rv-bar,
[data-recently-viewed],
[data-recent-products],
[class*="recently-viewed"],
[class*="recentlyViewed"],
[class*="recent-products"],
[class*="recentProducts"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
}

/* Old sticky product CTA bars only. Keep green WhatsApp float. */
body.kaw-remove-product-sticky #stickyWaBar,
body.kaw-remove-product-sticky .sticky-wa-bar,
body.kaw-remove-product-sticky .sticky-product-bar,
body.kaw-remove-product-sticky [id*="stickyWa"],
body.kaw-remove-product-sticky [class*="sticky-wa"],
body.kaw-remove-product-sticky [class*="sticky-product"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
}

/* Remove empty space left by old bars */
body.kaw-remove-product-sticky .site-shell,
body.kaw-remove-product-sticky main {
  padding-bottom: 40px !important;
}

/* Keep real WhatsApp floating button clean */
.wa-float,
#waFloatBtn,
button[aria-label*="WhatsApp"],
a[aria-label*="WhatsApp"] {
  z-index: 950 !important;
}
CSS

cat > js/kawthar-remove-obstructions.js <<'JS'
(function () {
  "use strict";

  const IS_PRODUCT = /product\.html/i.test(location.pathname);

  function clearRecentStorage() {
    try {
      Object.keys(localStorage).forEach((key) => {
        const k = key.toLowerCase();

        if (
          k.includes("recently") ||
          k.includes("recent_view") ||
          k.includes("recent-view") ||
          k.includes("viewed_products") ||
          k.includes("viewed-products")
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch {}
  }

  function text(el) {
    return (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function removeBySelector() {
    const selectors = [
      "#recentlyViewed",
      "#recentlyViewedWrap",
      "#recentlyViewedBar",
      "#recentProducts",
      "#recentlyProducts",
      ".recently-viewed",
      ".recentlyViewed",
      ".recently-products",
      ".recent-products",
      ".viewed-products",
      ".rv-strip",
      ".rv-bar",
      "[data-recently-viewed]",
      "[data-recent-products]",
      "[class*='recently-viewed']",
      "[class*='recentlyViewed']",
      "[class*='recent-products']",
      "[class*='recentProducts']"
    ];

    document.querySelectorAll(selectors.join(",")).forEach((el) => {
      el.remove();
    });
  }

  function removeRecentlyViewedByText() {
    const candidates = Array.from(document.querySelectorAll("section, aside, nav, div"));

    candidates
      .filter((el) => {
        const t = text(el);

        if (!t.includes("recently viewed")) return false;

        // Do not remove full drawer/body accidentally.
        if (t.includes("your selection") || t.includes("cart") || t.includes("checkout")) return false;
        if (el === document.body || el === document.documentElement) return false;

        return t.length < 1200;
      })
      .sort((a, b) => text(a).length - text(b).length)
      .forEach((el) => {
        if (document.body.contains(el)) el.remove();
      });
  }

  function looksLikeRealWhatsAppFloat(el) {
    const r = el.getBoundingClientRect();
    const t = text(el);
    const href = String(el.getAttribute("href") || "").toLowerCase();

    return (
      (href.includes("wa.me") || t === "" || t.includes("whatsapp")) &&
      r.width <= 90 &&
      r.height <= 90 &&
      r.right > window.innerWidth - 140 &&
      r.bottom > window.innerHeight - 160
    );
  }

  function removeOldProductStickyBars() {
    if (!IS_PRODUCT) return;

    document.body.classList.add("kaw-remove-product-sticky");

    const directSelectors = [
      "#stickyWaBar",
      ".sticky-wa-bar",
      ".sticky-product-bar",
      "[id*='stickyWa']",
      "[class*='sticky-wa']",
      "[class*='sticky-product']"
    ];

    document.querySelectorAll(directSelectors.join(",")).forEach((el) => {
      if (looksLikeRealWhatsAppFloat(el)) return;
      el.remove();
    });

    const candidates = Array.from(document.querySelectorAll("div, section, nav, aside, footer"));

    candidates.forEach((el) => {
      if (!document.body.contains(el)) return;
      if (el.closest("#kawProductUnifiedHeader")) return;
      if (looksLikeRealWhatsAppFloat(el)) return;

      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const t = text(el);

      const isWideBottomBar =
        (cs.position === "fixed" || cs.position === "sticky") &&
        r.width > Math.min(520, window.innerWidth * 0.45) &&
        r.height >= 36 &&
        r.height <= 180 &&
        r.bottom >= window.innerHeight - 170;

      const hasOldCtaText =
        t.includes("check on whatsapp") ||
        t.includes("order on whatsapp") ||
        t.includes("add to selection");

      const isMarkedOldBar =
        r.width > Math.min(520, window.innerWidth * 0.45) &&
        r.height >= 36 &&
        r.height <= 180 &&
        hasOldCtaText &&
        r.top > window.innerHeight * 0.55;

      if (isWideBottomBar || isMarkedOldBar) {
        el.remove();
      }
    });
  }

  function run() {
    clearRecentStorage();
    removeBySelector();
    removeRecentlyViewedByText();
    removeOldProductStickyBars();
  }

  let timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 250);
  setTimeout(run, 900);
  setTimeout(run, 1800);
  setTimeout(run, 3200);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR obstruction remover active.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

ver = "remove-obstructions-" + str(int(time.time()))
pages = ["index.html", "shop.html", "product.html", "checkout.html"]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")

    text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-remove-obstructions\.css\?v=[^"]*" />', '', text)
    text = re.sub(r'\s*<script src="\./js/kawthar-remove-obstructions\.js\?v=[^"]*"></script>', '', text)

    text = text.replace("\\n</body>", "</body>")
    text = text.replace("\\n<script", "<script")

    if "</head>" in text:
        text = text.replace(
            "</head>",
            f'  <link rel="stylesheet" href="./css/kawthar-remove-obstructions.css?v={ver}" />\n</head>',
            1
        )

    if "</body>" in text:
        text = text.replace(
            "</body>",
            f'  <script src="./js/kawthar-remove-obstructions.js?v={ver}"></script>\n</body>',
            1
        )

    p.write_text(text, encoding="utf-8")

print("Obstruction remover linked:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-remove-obstructions.js
fi

echo "=== VERIFY ==="
grep -n "kawthar-remove-obstructions" index.html shop.html product.html checkout.html || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/index.html?v=$STAMP"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/product.html?id=1774967141418&v=$STAMP"
