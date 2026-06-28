#!/usr/bin/env bash
set -e

echo "=== KAWTHAR SOCIAL LINKS UPGRADE ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css js

tar -czf "backups/backup-before-social-upgrade-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

INSTAGRAM_URL="https://www.instagram.com/kawthareg_/"
FACEBOOK_URL="https://www.facebook.com/groups/1123525308506342/"

echo "Writing social CSS..."
cat > css/kawthar-social-upgrade.css <<'CSS'
:root {
  --kaw-social-bg: rgba(255,250,246,0.80);
  --kaw-social-border: rgba(93,67,45,0.12);
  --kaw-social-text: #3f2e22;
  --kaw-social-muted: #6f5a47;
  --kaw-social-shadow: 0 12px 26px rgba(45,33,25,0.08);
  --kaw-social-instagram-1: #833ab4;
  --kaw-social-instagram-2: #fd1d1d;
  --kaw-social-instagram-3: #fcb045;
  --kaw-social-facebook: #1877f2;
}

.kaw-social-link {
  display: inline-flex !important;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 9px 14px;
  border-radius: 999px;
  text-decoration: none !important;
  color: var(--kaw-social-text) !important;
  background: var(--kaw-social-bg);
  border: 1px solid var(--kaw-social-border);
  box-shadow: var(--kaw-social-shadow);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease, background .22s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.kaw-social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(45,33,25,0.12);
  border-color: rgba(201,160,92,0.35);
}

.kaw-social-link:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 4px rgba(201,160,92,0.18), 0 16px 34px rgba(45,33,25,0.12);
}

.kaw-social-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22);
}

.kaw-social-instagram .kaw-social-icon-wrap {
  background: linear-gradient(135deg,
    var(--kaw-social-instagram-1) 0%,
    var(--kaw-social-instagram-2) 55%,
    var(--kaw-social-instagram-3) 100%);
}

.kaw-social-facebook .kaw-social-icon-wrap {
  background: linear-gradient(135deg, #1b74e4 0%, var(--kaw-social-facebook) 100%);
}

.kaw-social-icon {
  width: 16px;
  height: 16px;
  display: block;
  fill: #ffffff;
}

.kaw-social-text-block {
  display: inline-flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.kaw-social-label {
  font-size: 0.86rem;
  line-height: 1.1;
  font-weight: 900;
  color: var(--kaw-social-text);
  white-space: nowrap;
}

.kaw-social-sub {
  font-size: 0.68rem;
  line-height: 1.1;
  color: var(--kaw-social-muted);
  white-space: nowrap;
  letter-spacing: .03em;
}

.kaw-social-link svg {
  pointer-events: none;
}

@media (max-width: 640px) {
  .kaw-social-link {
    min-height: 40px;
    padding: 8px 12px;
    gap: 9px;
  }

  .kaw-social-icon-wrap {
    width: 28px;
    height: 28px;
  }

  .kaw-social-label {
    font-size: 0.82rem;
  }

  .kaw-social-sub {
    font-size: 0.64rem;
  }
}
CSS

echo "Writing social JS..."
cat > js/kawthar-social-upgrade.js <<'JS'
(function () {
  "use strict";

  const INSTAGRAM_URL = "https://www.instagram.com/kawthareg_/";
  const FACEBOOK_URL = "https://www.facebook.com/groups/1123525308506342/";

  const instagramSvg = `
    <svg class="kaw-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z"/>
    </svg>
  `;

  const facebookSvg = `
    <svg class="kaw-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.95c0-.9.25-1.5 1.55-1.5H16.7V4.7c-.3-.04-1.3-.11-2.47-.11-2.44 0-4.11 1.49-4.11 4.22v2.09H7.35V14h2.77v8h3.38Z"/>
    </svg>
  `;

  function socialMarkup(type) {
    if (type === "instagram") {
      return `
        <span class="kaw-social-icon-wrap">${instagramSvg}</span>
        <span class="kaw-social-text-block">
          <span class="kaw-social-label">Instagram</span>
          <span class="kaw-social-sub">@kawthareg_</span>
        </span>
      `;
    }

    return `
      <span class="kaw-social-icon-wrap">${facebookSvg}</span>
      <span class="kaw-social-text-block">
        <span class="kaw-social-label">Facebook</span>
        <span class="kaw-social-sub">KAWTHAR Community</span>
      </span>
    `;
  }

  function detectType(anchor) {
    const href = (anchor.getAttribute("href") || "").toLowerCase();
    const text = (anchor.textContent || "").toLowerCase();

    if (href.includes("instagram.com") || text.includes("instagram") || text.includes("insta")) {
      return "instagram";
    }

    if (href.includes("facebook.com") || text.includes("facebook") || text.includes("facebook")) {
      return "facebook";
    }

    return null;
  }

  function upgradeAnchor(anchor, type) {
    if (!anchor) return;
    if (anchor.dataset.kawSocialEnhanced === "1") return;

    anchor.dataset.kawSocialEnhanced = "1";
    anchor.classList.add("kaw-social-link", type === "instagram" ? "kaw-social-instagram" : "kaw-social-facebook");
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");

    if (type === "instagram") {
      anchor.setAttribute("href", INSTAGRAM_URL);
      anchor.setAttribute("aria-label", "Open KAWTHAR Instagram");
    } else {
      anchor.setAttribute("href", FACEBOOK_URL);
      anchor.setAttribute("aria-label", "Open KAWTHAR Facebook group");
    }

    anchor.innerHTML = socialMarkup(type);
  }

  function findSocialAnchors() {
    const anchors = Array.from(document.querySelectorAll('a[href], a'));

    anchors.forEach((a) => {
      const type = detectType(a);
      if (!type) return;
      upgradeAnchor(a, type);
    });
  }

  function run() {
    findSocialAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 500);
  setTimeout(run, 1500);

  console.info("KAWTHAR social links upgrade loaded.");
})();
JS

echo "Replacing old social links across project..."
find . \
  \( -path "./backups" -o -path "./node_modules" -o -path "./payment-server/node_modules" \) -prune -o \
  -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) \
  -print0 | while IFS= read -r -d '' file; do
    perl -0pi -e '
      s#https?://(www\.)?instagram\.com/[^"'\''\s<>()]+/?#https://www.instagram.com/kawthareg_/#gi;
      s#https?://(www\.)?facebook\.com/groups/1123525308506342[^"'\''\s<>()]*#https://www.facebook.com/groups/1123525308506342/#gi;
      s#https?://(www\.)?facebook\.com/[^"'\''\s<>()]+#https://www.facebook.com/groups/1123525308506342/#gi if /facebook/i;
    ' "$file"
done

echo "Linking CSS and JS into main pages..."
python3 - <<'PY'
from pathlib import Path
import re, time

ver = "social-" + str(int(time.time()))
pages = ["index.html", "shop.html", "product.html", "checkout.html"]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")

    text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-social-upgrade\.css\?v=[^"]*" />', '', text)
    text = re.sub(r'\s*<script src="\./js/kawthar-social-upgrade\.js\?v=[^"]*"></script>', '', text)

    if "</head>" in text:
        text = text.replace(
            "</head>",
            f'  <link rel="stylesheet" href="./css/kawthar-social-upgrade.css?v={ver}" />\n</head>',
            1
        )

    if "</body>" in text:
        text = text.replace(
            "</body>",
            f'  <script src="./js/kawthar-social-upgrade.js?v={ver}"></script>\n</body>',
            1
        )

    p.write_text(text, encoding="utf-8")

print("Social assets linked with version:", ver)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-social-upgrade.js
fi

echo "=== VERIFY ==="
grep -R "instagram.com/kawthareg_\|facebook.com/groups/1123525308506342" -n index.html shop.html product.html checkout.html js css | head -50 || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/index.html?v=social-$STAMP"
