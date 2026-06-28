#!/usr/bin/env bash
set -e

echo "=== KAWTHAR PRODUCT IMAGE FULL FIT FIX ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-product-image-full-fit-$STAMP.tar.gz" \
  product.html css js 2>/dev/null || true

cat > css/kawthar-product-image-full-fit.css <<'CSS'
/* =========================================================
   KAWTHAR PRODUCT IMAGE FULL FIT FIX
   Product page only.
   Shows full product image without cropping.
   Keeps card sizes controlled.
   ========================================================= */

body.kaw-product-full-fit {
  overflow-x: hidden !important;
}

/* Main product image card */
body.kaw-product-full-fit .kaw-fit-media-wrap,
body.kaw-product-full-fit .kaw-main-product-media,
body.kaw-product-full-fit .kaw-product-media-wrap-cap,
body.kaw-product-full-fit .product-page-media,
body.kaw-product-full-fit .product-gallery,
body.kaw-product-full-fit .product-media,
body.kaw-product-full-fit .product-image-card {
  position: relative !important;
  width: min(100%, 720px) !important;
  max-width: 720px !important;
  height: clamp(380px, 58vh, 560px) !important;
  min-height: 360px !important;
  max-height: 560px !important;
  margin-inline: auto !important;
  border-radius: 30px !important;
  overflow: hidden !important;
  background: #efe4d8 !important;
  border: 1px solid rgba(93,67,45,0.10) !important;
  box-shadow: 0 22px 58px rgba(45,33,25,0.10) !important;
  display: grid !important;
  place-items: center !important;
}

/* Cinematic blurred background from the same image */
body.kaw-product-full-fit .kaw-fit-media-wrap::before,
body.kaw-product-full-fit .kaw-main-product-media::before,
body.kaw-product-full-fit .kaw-product-media-wrap-cap::before {
  content: "";
  position: absolute;
  inset: -22px;
  background-image: var(--kaw-product-bg);
  background-size: cover;
  background-position: center;
  filter: blur(22px);
  transform: scale(1.08);
  opacity: 0.34;
  z-index: 0;
  pointer-events: none;
}

body.kaw-product-full-fit .kaw-fit-media-wrap::after,
body.kaw-product-full-fit .kaw-main-product-media::after,
body.kaw-product-full-fit .kaw-product-media-wrap-cap::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 42%, rgba(255,250,246,0.18), transparent 44%),
    linear-gradient(180deg, rgba(255,250,246,0.20), rgba(239,228,216,0.42));
  z-index: 1;
  pointer-events: none;
}

/* Main image: show full product, no crop */
body.kaw-product-full-fit .kaw-fit-product-img,
body.kaw-product-full-fit .kaw-product-media-img-cap,
body.kaw-product-full-fit .kaw-main-product-img,
body.kaw-product-full-fit .product-page-media img,
body.kaw-product-full-fit .product-gallery img,
body.kaw-product-full-fit .product-media img,
body.kaw-product-full-fit .product-image-card img {
  position: relative !important;
  z-index: 2 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 96% !important;
  max-height: 94% !important;
  object-fit: contain !important;
  object-position: center center !important;
  display: block !important;
  margin: auto !important;
  border-radius: 22px !important;
  box-shadow: none !important;
  background: transparent !important;
}

/* If an older patch forced the img itself to card size, override it */
body.kaw-product-full-fit img.kaw-product-media-img-cap,
body.kaw-product-full-fit img.kaw-main-product-img {
  height: 100% !important;
  min-height: 0 !important;
  max-height: 94% !important;
}

/* Related products should be compact and complete, not huge cropped banners */
body.kaw-product-full-fit .kaw-related-compact,
body.kaw-product-full-fit .kaw-related-stable {
  width: min(1180px, calc(100% - 40px)) !important;
  margin: 44px auto 34px !important;
}

body.kaw-product-full-fit .kaw-related-compact .product-card,
body.kaw-product-full-fit .kaw-related-stable .product-card,
body.kaw-product-full-fit .kaw-related-compact article,
body.kaw-product-full-fit .kaw-related-stable article {
  max-width: 320px !important;
  width: min(100%, 320px) !important;
}

body.kaw-product-full-fit .kaw-related-compact img,
body.kaw-product-full-fit .kaw-related-stable img {
  width: 100% !important;
  height: 220px !important;
  max-height: 220px !important;
  object-fit: contain !important;
  object-position: center center !important;
  background:
    radial-gradient(circle at center, rgba(255,250,246,0.68), rgba(239,228,216,0.92)) !important;
  border-radius: 22px !important;
  padding: 10px !important;
}

/* Keep product content layout balanced */
body.kaw-product-full-fit .product-page-grid,
body.kaw-product-full-fit .product-detail-grid,
body.kaw-product-full-fit .product-layout,
body.kaw-product-full-fit .product-main-grid {
  max-width: 1180px !important;
  margin-inline: auto !important;
  display: grid !important;
  grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr) !important;
  gap: clamp(28px, 4vw, 54px) !important;
  align-items: start !important;
}

/* Remove excessive blank area under product media if an old wrapper had fixed height */
body.kaw-product-full-fit .kaw-fit-media-wrap > *,
body.kaw-product-full-fit .kaw-main-product-media > *,
body.kaw-product-full-fit .kaw-product-media-wrap-cap > * {
  max-height: 100% !important;
}

/* Mobile */
@media (max-width: 860px) {
  body.kaw-product-full-fit .product-page-grid,
  body.kaw-product-full-fit .product-detail-grid,
  body.kaw-product-full-fit .product-layout,
  body.kaw-product-full-fit .product-main-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }

  body.kaw-product-full-fit .kaw-fit-media-wrap,
  body.kaw-product-full-fit .kaw-main-product-media,
  body.kaw-product-full-fit .kaw-product-media-wrap-cap,
  body.kaw-product-full-fit .product-page-media,
  body.kaw-product-full-fit .product-gallery,
  body.kaw-product-full-fit .product-media,
  body.kaw-product-full-fit .product-image-card {
    width: 100% !important;
    max-width: 100% !important;
    height: min(58vh, 420px) !important;
    min-height: 320px !important;
    max-height: 420px !important;
    border-radius: 24px !important;
  }

  body.kaw-product-full-fit .kaw-fit-product-img,
  body.kaw-product-full-fit .kaw-product-media-img-cap,
  body.kaw-product-full-fit .kaw-main-product-img,
  body.kaw-product-full-fit .product-page-media img,
  body.kaw-product-full-fit .product-gallery img,
  body.kaw-product-full-fit .product-media img,
  body.kaw-product-full-fit .product-image-card img {
    max-width: 96% !important;
    max-height: 92% !important;
    border-radius: 18px !important;
  }

  body.kaw-product-full-fit .kaw-related-compact,
  body.kaw-product-full-fit .kaw-related-stable {
    width: min(100% - 24px, 1180px) !important;
  }

  body.kaw-product-full-fit .kaw-related-compact img,
  body.kaw-product-full-fit .kaw-related-stable img {
    height: 200px !important;
    max-height: 200px !important;
  }
}

@media (max-width: 480px) {
  body.kaw-product-full-fit .kaw-fit-media-wrap,
  body.kaw-product-full-fit .kaw-main-product-media,
  body.kaw-product-full-fit .kaw-product-media-wrap-cap,
  body.kaw-product-full-fit .product-page-media,
  body.kaw-product-full-fit .product-gallery,
  body.kaw-product-full-fit .product-media,
  body.kaw-product-full-fit .product-image-card {
    height: min(54vh, 360px) !important;
    min-height: 280px !important;
    max-height: 360px !important;
  }
}
CSS

cat > js/kawthar-product-image-full-fit.js <<'JS'
(function () {
  "use strict";

  if (!/product\.html/i.test(location.pathname)) return;

  function isLogoOrUiImage(img) {
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

  function imageUrl(img) {
    return img.currentSrc || img.src || img.getAttribute("src") || "";
  }

  function findMainProductImage() {
    const imgs = Array.from(document.querySelectorAll("img")).filter((img) => {
      if (isLogoOrUiImage(img)) return false;
      if (img.closest("header")) return false;
      if (img.closest("footer")) return false;
      if (img.closest("[class*='drawer']")) return false;
      if (img.closest("[class*='cart']")) return false;

      const r = img.getBoundingClientRect();
      return r.width > 220 && r.height > 160;
    });

    if (!imgs.length) return null;

    imgs.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();

      /*
        Prefer the visible image in the top product area.
        Avoid lower related products.
      */
      const aScore = ar.width * ar.height - Math.max(0, ar.top) * 85;
      const bScore = br.width * br.height - Math.max(0, br.top) * 85;

      return bScore - aScore;
    });

    return imgs[0];
  }

  function bestWrapperFor(img) {
    let node = img.parentElement;
    let best = node;

    for (let i = 0; i < 5 && node && node !== document.body; i++) {
      const r = node.getBoundingClientRect();
      const text = (node.textContent || "").trim();

      const good =
        r.width >= img.getBoundingClientRect().width * 0.75 &&
        r.height >= img.getBoundingClientRect().height * 0.60 &&
        text.length < 420;

      if (good) best = node;
      node = node.parentElement;
    }

    return best || img.parentElement;
  }

  function applyMainFit() {
    const img = findMainProductImage();
    if (!img) return;

    const wrap = bestWrapperFor(img);
    const url = imageUrl(img);

    document.body.classList.add("kaw-product-full-fit");

    img.classList.add("kaw-fit-product-img");

    if (wrap) {
      wrap.classList.add("kaw-fit-media-wrap");

      if (url) {
        wrap.style.setProperty("--kaw-product-bg", `url("${url}")`);
      }
    }
  }

  function markRelatedArea() {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,.section-title,[class*='title']")).filter((el) => {
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

  function forceContainOnProductImages() {
    document.querySelectorAll(".kaw-fit-product-img,.kaw-product-media-img-cap,.kaw-main-product-img").forEach((img) => {
      img.style.objectFit = "contain";
      img.style.objectPosition = "center center";
    });
  }

  function run() {
    document.body.classList.add("kaw-product-full-fit");
    applyMainFit();
    markRelatedArea();
    forceContainOnProductImages();
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

  setTimeout(run, 300);
  setTimeout(run, 900);
  setTimeout(run, 1800);
  setTimeout(run, 3200);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR product image full-fit active.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

p = Path("product.html")
if not p.exists():
    raise SystemExit("ERROR: product.html not found")

ver = "full-fit-" + str(int(time.time()))
text = p.read_text(encoding="utf-8", errors="ignore")

text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-product-image-full-fit\.css\?v=[^"]*" />', '', text)
text = re.sub(r'\s*<script src="\./js/kawthar-product-image-full-fit\.js\?v=[^"]*"></script>', '', text)

text = text.replace("\\n</body>", "</body>")
text = text.replace("\\n<script", "<script")

if "</head>" in text:
    text = text.replace(
        "</head>",
        f'  <link rel="stylesheet" href="./css/kawthar-product-image-full-fit.css?v={ver}" />\n</head>',
        1
    )

if "</body>" in text:
    text = text.replace(
        "</body>",
        f'  <script src="./js/kawthar-product-image-full-fit.js?v={ver}"></script>\n</body>',
        1
    )

p.write_text(text, encoding="utf-8")
print("Product image full-fit linked:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-product-image-full-fit.js
fi

echo "=== VERIFY ==="
grep -n "kawthar-product-image-full-fit" product.html || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/product.html?id=1774966349190&v=$STAMP"
