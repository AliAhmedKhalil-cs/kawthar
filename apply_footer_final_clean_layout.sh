#!/usr/bin/env bash
set -e

echo "=== KAWTHAR FOOTER FINAL CLEAN LAYOUT ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-footer-final-clean-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

cat > css/kawthar-footer-final-clean.css <<'CSS'
/* =========================================================
   KAWTHAR FOOTER FINAL CLEAN
   Final footer structure. No filler text. No duplicated socials.
   ========================================================= */

.kaw-footer-clean {
  position: relative;
  background:
    radial-gradient(circle at 12% 0%, rgba(201,160,92,0.14), transparent 32%),
    linear-gradient(180deg, #f8f1ea 0%, #eadfd3 100%) !important;
  color: #3f2e22 !important;
  border-top: 1px solid rgba(93,67,45,0.12);
  padding: 58px 0 30px;
  overflow: hidden;
}

.kaw-footer-clean * {
  box-sizing: border-box;
}

.kaw-footer-clean::before {
  content: "";
  position: absolute;
  width: 520px;
  height: 520px;
  left: -220px;
  top: -220px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(201,160,92,0.12), transparent 68%);
  pointer-events: none;
}

.kaw-footer-clean .kaw-footer-container {
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
  position: relative;
  z-index: 2;
}

.kaw-footer-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.8fr 0.9fr 1fr;
  gap: clamp(34px, 5vw, 74px);
  align-items: start;
}

.kaw-footer-brand {
  max-width: 380px;
}

.kaw-footer-logo-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.kaw-footer-logo-row img {
  width: 74px;
  height: 74px;
  object-fit: contain;
  opacity: 0.94;
  filter: drop-shadow(0 12px 20px rgba(45,33,25,0.08));
}

.kaw-footer-brand-title {
  display: grid;
  gap: 5px;
}

.kaw-footer-brand-title strong {
  color: #2d2119;
  font-size: 1.05rem;
  letter-spacing: 0.18em;
  font-weight: 950;
}

.kaw-footer-brand-title span {
  color: #8b6847;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 850;
}

.kaw-footer-desc {
  margin: 0;
  color: #5b4635;
  font-size: 0.94rem;
  line-height: 1.85;
  max-width: 350px;
}

.kaw-footer-col h3 {
  margin: 0 0 18px;
  color: #2d2119;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 950;
}

.kaw-footer-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 13px;
}

.kaw-footer-list a,
.kaw-footer-list span {
  color: #4b3829 !important;
  text-decoration: none !important;
  font-size: 0.92rem;
  line-height: 1.45;
  font-weight: 760;
}

.kaw-footer-list a:hover {
  color: #9b6a2f !important;
}

.kaw-footer-contact-stack {
  display: grid;
  gap: 10px;
  max-width: 270px;
}

.kaw-footer-social {
  display: flex !important;
  align-items: center;
  gap: 11px;
  min-height: 46px;
  padding: 9px 13px;
  border-radius: 999px;
  text-decoration: none !important;
  background:
    radial-gradient(circle at 12% 0%, rgba(201,160,92,0.12), transparent 40%),
    rgba(255,250,246,0.80);
  border: 1px solid rgba(93,67,45,0.12);
  color: #2d2119 !important;
  box-shadow: 0 12px 28px rgba(45,33,25,0.08);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}

.kaw-footer-social:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(45,33,25,0.13);
  border-color: rgba(201,160,92,0.36);
}

.kaw-footer-social-icon {
  width: 31px;
  height: 31px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 950;
  letter-spacing: -0.02em;
}

.kaw-footer-social.wa .kaw-footer-social-icon {
  background: #25d366;
}

.kaw-footer-social.ig .kaw-footer-social-icon {
  background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 55%, #fcb045 100%);
}

.kaw-footer-social.fb .kaw-footer-social-icon {
  background: #1877f2;
}

.kaw-footer-social-copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.kaw-footer-social-copy strong {
  color: #2d2119 !important;
  font-size: 0.86rem;
  line-height: 1.1;
  font-weight: 950;
}

.kaw-footer-social-copy span {
  color: #6f5a47 !important;
  font-size: 0.68rem;
  line-height: 1.1;
  font-weight: 760;
}

.kaw-footer-bottom {
  margin-top: 44px;
  padding-top: 22px;
  border-top: 1px solid rgba(93,67,45,0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  color: #6f5a47;
  font-size: 0.78rem;
  font-weight: 750;
}

.kaw-footer-bottom-note {
  color: #6f5a47;
}

/* Force-hide previous filler blocks if another script injects them */
footer .kaw-footer-social-final,
footer .kaw-footer-contact-social,
footer .kaw-social-link,
footer .kaw-final-note,
footer .kaw-final-badge,
footer .kaw-final-tags,
footer .kaw-footer-tags,
footer [class*="payment"],
footer [class*="tag"] {
  display: none !important;
}

@media (max-width: 920px) {
  .kaw-footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .kaw-footer-brand {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .kaw-footer-clean {
    padding: 46px 0 26px;
  }

  .kaw-footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .kaw-footer-logo-row img {
    width: 64px;
    height: 64px;
  }

  .kaw-footer-contact-stack {
    max-width: 100%;
  }

  .kaw-footer-social {
    width: min(100%, 290px);
  }

  .kaw-footer-bottom {
    margin-top: 34px;
  }
}
CSS

cat > js/kawthar-footer-final-clean.js <<'JS'
(function () {
  "use strict";

  const WA_NUMBER = "201034110499";
  const IG_URL = "https://www.instagram.com/kawthareg_/";
  const FB_URL = "https://www.facebook.com/groups/1123525308506342/";

  function waUrl() {
    const msg = "Hi KAWTHAR, I would like to ask about your products.";
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function getLogoSrc() {
    const imgs = Array.from(document.querySelectorAll("img"));
    const logo = imgs.find((img) => {
      const data = [
        img.getAttribute("src") || "",
        img.getAttribute("alt") || "",
        img.getAttribute("class") || ""
      ].join(" ").toLowerCase();

      return data.includes("logo") || data.includes("kawthar");
    });

    return logo?.getAttribute("src") || "./assets/logo/kawthar-logo-hd.webp";
  }

  function footerHTML() {
    const logo = getLogoSrc();

    return `
      <div class="kaw-footer-container">
        <div class="kaw-footer-grid">
          <div class="kaw-footer-brand">
            <a class="kaw-footer-logo-row" href="./index.html" aria-label="KAWTHAR Home">
              <img src="${logo}" alt="KAWTHAR Logo" loading="lazy" decoding="async">
              <span class="kaw-footer-brand-title">
                <strong>KAWTHAR</strong>
                <span>Accessories & Artisan Bags</span>
              </span>
            </a>

            <p class="kaw-footer-desc">
              Premium stainless steel anti-rust accessories and handmade artisan bags curated for a soft feminine luxury style.
            </p>
          </div>

          <div class="kaw-footer-col">
            <h3>Shop</h3>
            <ul class="kaw-footer-list">
              <li><a href="./shop.html">All products</a></li>
              <li><a href="./index.html#collections">Collections</a></li>
              <li><a href="./index.html#featured">Featured pieces</a></li>
            </ul>
          </div>

          <div class="kaw-footer-col">
            <h3>Order</h3>
            <ul class="kaw-footer-list">
              <li><a href="./checkout.html">Checkout</a></li>
              <li><span>InstaPay confirmation</span></li>
              <li><span>WhatsApp support</span></li>
            </ul>
          </div>

          <div class="kaw-footer-col">
            <h3>Contact</h3>

            <div class="kaw-footer-contact-stack">
              <a class="kaw-footer-social wa" href="${waUrl()}" target="_blank" rel="noreferrer noopener" aria-label="Contact KAWTHAR on WhatsApp">
                <span class="kaw-footer-social-icon">W</span>
                <span class="kaw-footer-social-copy">
                  <strong>WhatsApp</strong>
                  <span>Direct inquiry</span>
                </span>
              </a>

              <a class="kaw-footer-social ig" href="${IG_URL}" target="_blank" rel="noreferrer noopener" aria-label="Open KAWTHAR Instagram">
                <span class="kaw-footer-social-icon">IG</span>
                <span class="kaw-footer-social-copy">
                  <strong>Instagram</strong>
                  <span>@kawthareg_</span>
                </span>
              </a>

              <a class="kaw-footer-social fb" href="${FB_URL}" target="_blank" rel="noreferrer noopener" aria-label="Open KAWTHAR Facebook group">
                <span class="kaw-footer-social-icon">f</span>
                <span class="kaw-footer-social-copy">
                  <strong>Facebook</strong>
                  <span>KAWTHAR group</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div class="kaw-footer-bottom">
          <span>© KAWTHAR Accessories</span>
          <span class="kaw-footer-bottom-note">Premium accessories. Direct ordering through WhatsApp.</span>
        </div>
      </div>
    `;
  }

  function normalizeLinks() {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const text = (a.textContent || "").toLowerCase();

      if (href.includes("instagram.com") || text.includes("instagram")) {
        a.href = IG_URL;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("facebook.com") || text.includes("facebook")) {
        a.href = FB_URL;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("wa.me") || href.includes("whatsapp") || text.includes("whatsapp")) {
        a.href = waUrl();
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }
    });
  }

  function rebuildFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    if (footer.dataset.kawFooterFinalClean === "1") {
      normalizeLinks();
      return;
    }

    footer.dataset.kawFooterFinalClean = "1";
    footer.className = "kaw-footer-clean";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = footerHTML();

    normalizeLinks();
  }

  let timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(rebuildFooter, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", rebuildFooter);
  } else {
    rebuildFooter();
  }

  setTimeout(rebuildFooter, 300);
  setTimeout(rebuildFooter, 1200);
  setTimeout(rebuildFooter, 2600);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR footer final clean active.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

ver = "footer-final-clean-" + str(int(time.time()))
pages = ["index.html", "shop.html", "product.html", "checkout.html"]

remove_patterns = [
    r'\s*<link rel="stylesheet" href="\./css/kawthar-footer-social-final\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-footer-social-final\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-footer-contact-social\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-footer-contact-social\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-social-upgrade\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-social-upgrade\.js\?v=[^"]*"></script>',
    r'\s*<link rel="stylesheet" href="\./css/kawthar-footer-final-clean\.css\?v=[^"]*" />',
    r'\s*<script src="\./js/kawthar-footer-final-clean\.js\?v=[^"]*"></script>',
]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")

    for pat in remove_patterns:
        text = re.sub(pat, "", text)

    text = text.replace("\\n</body>", "</body>")
    text = text.replace("\\n<script", "<script")

    if "</head>" in text:
        text = text.replace(
            "</head>",
            f'  <link rel="stylesheet" href="./css/kawthar-footer-final-clean.css?v={ver}" />\n</head>',
            1
        )

    if "</body>" in text:
        text = text.replace(
            "</body>",
            f'  <script src="./js/kawthar-footer-final-clean.js?v={ver}"></script>\n</body>',
            1
        )

    p.write_text(text, encoding="utf-8")

print("Footer final clean linked:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-footer-final-clean.js
fi

echo "=== VERIFY ==="
grep -n "kawthar-footer-final-clean\|kawthar-footer-contact-social\|kawthar-footer-social-final\|kawthar-social-upgrade" index.html shop.html product.html checkout.html || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/index.html?v=$STAMP"
