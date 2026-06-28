#!/usr/bin/env bash
set -e

echo "=== KAWTHAR FOOTER CONTACT SOCIAL CLEAN ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-footer-contact-social-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

cat > css/kawthar-footer-contact-social.css <<'CSS'
/* =========================================================
   KAWTHAR FOOTER CONTACT SOCIAL CLEAN
   Remove plain social text and show 3 vertical graphic chips.
   ========================================================= */

.kaw-footer-contact-social {
  display: grid !important;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 14px;
  max-width: 260px;
}

.kaw-footer-contact-social a {
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
  box-shadow: 0 12px 28px rgba(45,33,25,0.08);
  color: #2d2119 !important;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.kaw-footer-contact-social a:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(45,33,25,0.13);
  border-color: rgba(201,160,92,0.36);
}

.kaw-footer-contact-social .social-icon {
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
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
}

.kaw-footer-contact-social .wa .social-icon {
  background: #25d366;
}

.kaw-footer-contact-social .ig .social-icon {
  background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 55%, #fcb045 100%);
}

.kaw-footer-contact-social .fb .social-icon {
  background: #1877f2;
}

.kaw-footer-contact-social .social-copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.kaw-footer-contact-social .social-copy strong {
  color: #2d2119 !important;
  font-size: 0.86rem;
  line-height: 1.1;
  font-weight: 900;
}

.kaw-footer-contact-social .social-copy span {
  color: #6f5a47 !important;
  font-size: 0.68rem;
  line-height: 1.1;
  font-weight: 750;
}

/* Hide previous duplicated graphic social blocks if old scripts created them */
footer .kaw-footer-social-final,
footer .kaw-social-link {
  display: none !important;
}

@media (max-width: 640px) {
  .kaw-footer-contact-social {
    max-width: 100%;
  }

  .kaw-footer-contact-social a {
    width: min(100%, 280px);
  }
}
CSS

cat > js/kawthar-footer-contact-social.js <<'JS'
(function () {
  "use strict";

  const WA_NUMBER = "201034110499";
  const IG_URL = "https://www.instagram.com/kawthareg_/";
  const FB_URL = "https://www.facebook.com/groups/1123525308506342/";

  function waUrl() {
    const msg = "Hi KAWTHAR, I would like to ask about your products.";
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function socialHTML() {
    return `
      <div class="kaw-footer-contact-social" aria-label="KAWTHAR social links">
        <a class="wa" href="${waUrl()}" target="_blank" rel="noreferrer noopener" aria-label="Contact KAWTHAR on WhatsApp">
          <span class="social-icon">W</span>
          <span class="social-copy">
            <strong>WhatsApp</strong>
            <span>Direct inquiry</span>
          </span>
        </a>

        <a class="ig" href="${IG_URL}" target="_blank" rel="noreferrer noopener" aria-label="Open KAWTHAR Instagram">
          <span class="social-icon">IG</span>
          <span class="social-copy">
            <strong>Instagram</strong>
            <span>@kawthareg_</span>
          </span>
        </a>

        <a class="fb" href="${FB_URL}" target="_blank" rel="noreferrer noopener" aria-label="Open KAWTHAR Facebook group">
          <span class="social-icon">f</span>
          <span class="social-copy">
            <strong>Facebook</strong>
            <span>KAWTHAR group</span>
          </span>
        </a>
      </div>
    `;
  }

  function textOf(el) {
    return (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function findContactColumn(footer) {
    const headings = Array.from(footer.querySelectorAll("h1,h2,h3,h4,h5,h6,strong,b,span,div"));
    const contactHeading = headings.find((el) => textOf(el) === "contact");

    if (!contactHeading) return footer;

    const classTargets = [
      ".kaw-final-col",
      ".footer-col",
      ".footer-column",
      ".cin-footer__col",
      "[class*='footer'][class*='col']",
      "[class*='col']"
    ];

    for (const selector of classTargets) {
      const found = contactHeading.closest(selector);
      if (found && footer.contains(found)) return found;
    }

    return contactHeading.parentElement || footer;
  }

  function removeOldSocialBlocks(footer) {
    footer.querySelectorAll(".kaw-footer-social-final, .kaw-social-link, .kaw-footer-contact-social").forEach((el) => {
      el.remove();
    });
  }

  function removePlainSocialText(contactCol) {
    const socialWords = ["whatsapp", "instagram", "facebook"];

    const nodes = Array.from(contactCol.querySelectorAll("a, li, p, span, strong, b, div"));

    nodes.forEach((el) => {
      if (el.closest(".kaw-footer-contact-social")) return;

      const t = textOf(el);
      if (!t) return;

      const isPlainSocial =
        socialWords.includes(t) ||
        t === "@kawthareg_" ||
        t.includes("instagram @kawthareg_") ||
        t.includes("facebook kawthar") ||
        t.includes("whatsapp direct");

      const isSmallSocialLine =
        t.length <= 45 &&
        socialWords.some((word) => t.includes(word));

      if (!isPlainSocial && !isSmallSocialLine) return;

      const parent = el.parentElement;

      if (parent && ["LI", "P"].includes(parent.tagName)) {
        parent.remove();
        return;
      }

      el.remove();
    });
  }

  function normalizeLinks() {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const txt = textOf(a);

      if (href.includes("instagram.com") || txt.includes("instagram")) {
        a.href = IG_URL;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("facebook.com") || txt.includes("facebook")) {
        a.href = FB_URL;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("wa.me") || href.includes("whatsapp") || txt.includes("whatsapp")) {
        a.href = waUrl();
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }
    });
  }

  function injectContactSocial(contactCol) {
    if (!contactCol) return;

    const heading = Array.from(contactCol.querySelectorAll("h1,h2,h3,h4,h5,h6,strong,b,span,div"))
      .find((el) => textOf(el) === "contact");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = socialHTML().trim();
    const social = wrapper.firstElementChild;

    if (heading && heading.parentElement === contactCol) {
      heading.insertAdjacentElement("afterend", social);
      return;
    }

    const firstHeading = contactCol.querySelector("h1,h2,h3,h4,h5,h6");
    if (firstHeading) {
      firstHeading.insertAdjacentElement("afterend", social);
      return;
    }

    contactCol.appendChild(social);
  }

  function cleanFooterText() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.innerHTML = footer.innerHTML
      .replace(/Online payment gateway is being prepared for card and wallet payments\./gi, "Manual payment via InstaPay. Confirmation is completed on WhatsApp after the transfer screenshot.")
      .replace(/Card payment soon/gi, "InstaPay confirmation")
      .replace(/Mobile wallet soon/gi, "WhatsApp support");
  }

  function run() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    cleanFooterText();

    const contactCol = findContactColumn(footer);

    removeOldSocialBlocks(footer);
    removePlainSocialText(contactCol);
    injectContactSocial(contactCol);
    normalizeLinks();
  }

  let timer = null;
  function scheduleRun() {
    clearTimeout(timer);
    timer = setTimeout(run, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 400);
  setTimeout(run, 1200);
  setTimeout(run, 2400);

  const observer = new MutationObserver(scheduleRun);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR footer contact social clean active.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

ver = "footer-contact-social-" + str(int(time.time()))
pages = ["index.html", "shop.html", "product.html", "checkout.html"]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")

    # Remove old social scripts/styles that caused duplicates
    remove_patterns = [
        r'\s*<link rel="stylesheet" href="\./css/kawthar-footer-social-final\.css\?v=[^"]*" />',
        r'\s*<script src="\./js/kawthar-footer-social-final\.js\?v=[^"]*"></script>',
        r'\s*<link rel="stylesheet" href="\./css/kawthar-social-upgrade\.css\?v=[^"]*" />',
        r'\s*<script src="\./js/kawthar-social-upgrade\.js\?v=[^"]*"></script>',
        r'\s*<link rel="stylesheet" href="\./css/kawthar-footer-contact-social\.css\?v=[^"]*" />',
        r'\s*<script src="\./js/kawthar-footer-contact-social\.js\?v=[^"]*"></script>',
    ]

    for pat in remove_patterns:
        text = re.sub(pat, "", text)

    # Clean accidental literal newline text from old injections
    text = text.replace("\\n</body>", "</body>")
    text = text.replace("\\n<script", "<script")

    # Update raw social URLs if present
    text = re.sub(
        r'https?://(?:www\.)?instagram\.com/[^"\'\s<>()]+/?',
        'https://www.instagram.com/kawthareg_/',
        text,
        flags=re.I
    )

    text = re.sub(
        r'https?://(?:www\.)?facebook\.com/groups/1123525308506342[^"\'\s<>()]*',
        'https://www.facebook.com/groups/1123525308506342/',
        text,
        flags=re.I
    )

    if "</head>" in text:
        text = text.replace(
            "</head>",
            f'  <link rel="stylesheet" href="./css/kawthar-footer-contact-social.css?v={ver}" />\n</head>',
            1
        )

    if "</body>" in text:
        text = text.replace(
            "</body>",
            f'  <script src="./js/kawthar-footer-contact-social.js?v={ver}"></script>\n</body>',
            1
        )

    p.write_text(text, encoding="utf-8")

print("Footer contact social clean linked:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-footer-contact-social.js
fi

echo "=== VERIFY ==="
grep -n "kawthar-footer-contact-social\|kawthar-footer-social-final\|kawthar-social-upgrade" index.html shop.html product.html checkout.html || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/index.html?v=$STAMP"
