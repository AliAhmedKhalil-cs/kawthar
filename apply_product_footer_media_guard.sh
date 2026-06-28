#!/usr/bin/env bash
set -e

echo "=== KAWTHAR PRODUCT FOOTER + MEDIA GUARD ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-product-footer-media-guard-$STAMP.tar.gz" \
  product.html css js 2>/dev/null || true

cat > css/kawthar-product-footer-media-guard.css <<'CSS'
/* =========================================================
   PRODUCT FOOTER + MEDIA GUARD
   Fixes product page footer gutters and oversized images only.
   ========================================================= */

body.kaw-pf-guard {
  overflow-x: hidden !important;
}

/* Make product footer full bleed, even if it is inside a container */
body.kaw-pf-guard footer,
body.kaw-pf-guard footer.kaw-footer-clean {
  width: 100vw !important;
  max-width: 100vw !important;
  margin-left: calc(50% - 50vw) !important;
  margin-right: calc(50% - 50vw) !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  border-radius: 0 !important;
  overflow: hidden !important;
}

body.kaw-pf-guard footer .kaw-footer-container {
  width: min(1180px, calc(100% - 40px)) !important;
  max-width: 1180px !important;
  margin-inline: auto !important;
}

/* Remove accidental visible "\n" text leftovers */
body.kaw-pf-guard .kaw-visible-newline-cleaned {
  display: none !important;
}

/* Main / oversized product images */
body.kaw-pf-guard .kaw-product-media-img-cap {
  display: block !important;
  width: min(100%, 620px) !important;
  max-width: 620px !important;
  height: clamp(300px, 46vh, 470px) !important;
  max-height: 470px !important;
  min-height: 280px !important;
  object-fit: cover !important;
  object-position: center 42% !important;
  margin-inline: auto !important;
  border-radius: 28px !important;
  box-shadow: 0 22px 58px rgba(45,33,25,0.10) !important;
}

body.kaw-pf-guard .kaw-product-media-wrap-cap {
  width: min(100%, 660px) !important;
  max-width: 660px !important;
  margin-inline: auto !important;
  overflow: visible !important;
  border-radius: 30px !important;
}

/* Product grid should stay balanced, not full-screen image only */
body.kaw-pf-guard .product-page-grid,
body.kaw-pf-guard .product-detail-grid,
body.kaw-pf-guard .product-layout,
body.kaw-pf-guard .product-main-grid {
  max-width: 1180px !important;
  margin-inline: auto !important;
  display: grid !important;
  grid-template-columns: minmax(0, 0.9fr) minmax(360px, 1.1fr) !important;
  gap: clamp(26px, 4vw, 52px) !important;
  align-items: start !important;
}

/* Related products / You may also like */
body.kaw-pf-guard .kaw-related-compact {
  width: min(1180px, calc(100% - 40px)) !important;
  margin: 44px auto 26px !important;
  padding: 0 !important;
}

body.kaw-pf-guard .kaw-related-compact h1,
body.kaw-pf-guard .kaw-related-compact h2,
body.kaw-pf-guard .kaw-related-compact h3,
body.kaw-pf-guard .kaw-related-compact .section-title {
  font-size: clamp(2rem, 4vw, 3.6rem) !important;
  line-height: 1.02 !important;
  margin-bottom: 22px !important;
}

body.kaw-pf-guard .kaw-related-compact .product-card,
body.kaw-pf-guard .kaw-related-compact article,
body.kaw-pf-guard .kaw-related-compact [class*="product-card"] {
  max-width: 360px !important;
  width: min(100%, 360px) !important;
}

body.kaw-pf-guard .kaw-related-compact img {
  width: 100% !important;
  height: 230px !important;
  max-height: 230px !important;
  object-fit: cover !important;
  object-position: center !important;
  border-radius: 22px !important;
}

/* Prevent any product image directly above footer from becoming a giant banner */
body.kaw-pf-guard footer ~ img,
body.kaw-pf-guard img.kaw-product-near-footer {
  max-height: 260px !important;
}

/* Mobile */
@media (max-width: 860px) {
  body.kaw-pf-guard .product-page-grid,
  body.kaw-pf-guard .product-detail-grid,
  body.kaw-pf-guard .product-layout,
  body.kaw-pf-guard .product-main-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }

  body.kaw-pf-guard .kaw-product-media-img-cap {
    width: 100% !important;
    max-width: 100% !important;
    height: min(52vh, 340px) !important;
    min-height: 250px !important;
    max-height: 340px !important;
    border-radius: 24px !important;
  }

  body.kaw-pf-guard .kaw-product-media-wrap-cap {
    width: 100% !important;
    max-width: 100% !important;
  }

  body.kaw-pf-guard footer .kaw-footer-container,
  body.kaw-pf-guard .kaw-related-compact {
    width: min(100% - 24px, 1180px) !important;
  }

  body.kaw-pf-guard .kaw-related-compact img {
    height: 210px !important;
    max-height: 210px !important;
  }
}
CSS

cat > js/kawthar-product-footer-media-guard.js <<'JS'
(function () {
  "use strict";

  if (!/product\.html/i.test(location.pathname)) return;

  function isLogoOrIcon(img) {
    const data = [
      img.getAttribute("src") || "",
      img.getAttribute("alt") || "",
      img.getAttribute("class") || "",
      img.getAttribute("id") || ""
    ].join(" ").toLowerCase();

    return (
      data.includes("logo") ||
      data.includes("icon") ||
      data.includes("whatsapp") ||
      data.includes("facebook") ||
      data.includes("instagram")
    );
  }

  function moveFooterOutOfShell() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    if (footer.parentElement !== document.body) {
      document.body.appendChild(footer);
    }
  }

  function removeVisibleNewlineText() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = (node.nodeValue || "").trim();

      if (value === "\\n" || value === "\\n\\n") {
        nodes.push(node);
      }
    }

    nodes.forEach((node) => {
      const span = document.createElement("span");
      span.className = "kaw-visible-newline-cleaned";
      node.parentNode && node.parentNode.replaceChild(span, node);
    });
  }

  function capOversizedProductImages() {
    const imgs = Array.from(document.querySelectorAll("img")).filter((img) => {
      if (isLogoOrIcon(img)) return false;
      if (img.closest("header")) return false;
      if (img.closest("footer")) return false;
      if (img.closest(".cart-drawer")) return false;
      if (img.closest("[class*='drawer']")) return false;

      const r = img.getBoundingClientRect();
      return r.width > 420 || r.height > 360;
    });

    imgs.forEach((img) => {
      img.classList.add("kaw-product-media-img-cap");

      let node = img.parentElement;
      let best = node;

      for (let i = 0; i < 4 && node && node !== document.body; i++) {
        const text = (node.textContent || "").trim();
        const r = node.getBoundingClientRect();

        if (text.length < 320 && r.width >= img.getBoundingClientRect().width * 0.75) {
          best = node;
        }

        node = node.parentElement;
      }

      if (best) best.classList.add("kaw-product-media-wrap-cap");
    });
  }

  function compactRelatedArea() {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,.section-title,[class*='title']"))
      .filter((el) => {
        const t = (el.textContent || "").toLowerCase();
        return t.includes("you may also like") || t.includes("related");
      });

    headings.forEach((heading) => {
      let node = heading.parentElement;

      for (let i = 0; i < 5 && node && node !== document.body; i++) {
        const t = (node.textContent || "").toLowerCase();

        if (t.includes("you may also like") || t.includes("related")) {
          node.classList.add("kaw-related-compact");
          break;
        }

        node = node.parentElement;
      }
    });
  }

  function markImagesNearFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const footerTop = footer.getBoundingClientRect().top + window.scrollY;

    document.querySelectorAll("img").forEach((img) => {
      if (isLogoOrIcon(img)) return;

      const top = img.getBoundingClientRect().top + window.scrollY;

      if (top > footerTop - 900 && top < footerTop + 80) {
        img.classList.add("kaw-product-near-footer");
      }
    });
  }

  function run() {
    document.body.classList.add("kaw-pf-guard");

    moveFooterOutOfShell();
    removeVisibleNewlineText();
    compactRelatedArea();
    capOversizedProductImages();
    markImagesNearFooter();
  }

  let timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 350);
  setTimeout(run, 1000);
  setTimeout(run, 2200);
  setTimeout(run, 3800);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR product footer/media guard active.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

p = Path("product.html")
if not p.exists():
    raise SystemExit("ERROR: product.html not found")

ver = "pf-guard-" + str(int(time.time()))
text = p.read_text(encoding="utf-8", errors="ignore")

text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-product-footer-media-guard\.css\?v=[^"]*" />', '', text)
text = re.sub(r'\s*<script src="\./js/kawthar-product-footer-media-guard\.js\?v=[^"]*"></script>', '', text)

text = text.replace("\\n</body>", "</body>")
text = text.replace("\\n<script", "<script")

if "</head>" in text:
    text = text.replace(
        "</head>",
        f'  <link rel="stylesheet" href="./css/kawthar-product-footer-media-guard.css?v={ver}" />\n</head>',
        1
    )

if "</body>" in text:
    text = text.replace(
        "</body>",
        f'  <script src="./js/kawthar-product-footer-media-guard.js?v={ver}"></script>\n</body>',
        1
    )

p.write_text(text, encoding="utf-8")
print("Product footer/media guard linked:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-product-footer-media-guard.js
fi

echo "=== VERIFY ==="
grep -n "kawthar-product-footer-media-guard" product.html || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/product.html?id=1774966349190&v=$STAMP"
