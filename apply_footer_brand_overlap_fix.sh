#!/usr/bin/env bash
set -e

echo "=== KAWTHAR FOOTER BRAND OVERLAP FIX ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups css

tar -czf "backups/backup-before-footer-brand-overlap-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

cat > css/kawthar-footer-brand-overlap-fix.css <<'CSS'
/* =========================================================
   KAWTHAR FOOTER BRAND OVERLAP FIX
   Fixes overlapped logo/title/description in footer only.
   Safe CSS-only patch.
   ========================================================= */

footer.kaw-footer-clean .kaw-footer-brand,
.kaw-footer-clean .kaw-footer-brand {
  display: grid !important;
  grid-template-columns: 1fr !important;
  grid-template-rows: auto auto !important;
  align-items: start !important;
  gap: 18px !important;
  max-width: 390px !important;
  min-width: 0 !important;
  position: relative !important;
  overflow: visible !important;
}

footer.kaw-footer-clean .kaw-footer-logo-row,
.kaw-footer-clean .kaw-footer-logo-row {
  display: grid !important;
  grid-template-columns: 74px minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 16px !important;
  width: 100% !important;
  min-width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  position: static !important;
  transform: none !important;
  float: none !important;
  text-decoration: none !important;
  color: inherit !important;
}

footer.kaw-footer-clean .kaw-footer-logo-row img,
.kaw-footer-clean .kaw-footer-logo-row img {
  grid-column: 1 !important;
  width: 74px !important;
  height: 74px !important;
  max-width: 74px !important;
  max-height: 74px !important;
  object-fit: contain !important;
  display: block !important;
  position: static !important;
  transform: none !important;
  float: none !important;
  margin: 0 !important;
}

footer.kaw-footer-clean .kaw-footer-brand-title,
.kaw-footer-clean .kaw-footer-brand-title {
  grid-column: 2 !important;
  display: grid !important;
  gap: 7px !important;
  min-width: 0 !important;
  width: 100% !important;
  position: static !important;
  transform: none !important;
  float: none !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1.2 !important;
}

footer.kaw-footer-clean .kaw-footer-brand-title strong,
.kaw-footer-clean .kaw-footer-brand-title strong {
  display: block !important;
  color: #2d2119 !important;
  font-size: 1.05rem !important;
  line-height: 1.15 !important;
  letter-spacing: 0.18em !important;
  font-weight: 950 !important;
  margin: 0 !important;
  padding: 0 !important;
  position: static !important;
  transform: none !important;
  white-space: normal !important;
}

footer.kaw-footer-clean .kaw-footer-brand-title span,
.kaw-footer-clean .kaw-footer-brand-title span {
  display: block !important;
  color: #8b6847 !important;
  font-size: 0.72rem !important;
  line-height: 1.45 !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
  font-weight: 850 !important;
  margin: 0 !important;
  padding: 0 !important;
  position: static !important;
  transform: none !important;
  white-space: normal !important;
  max-width: 220px !important;
}

footer.kaw-footer-clean .kaw-footer-desc,
.kaw-footer-clean .kaw-footer-desc {
  display: block !important;
  width: 100% !important;
  max-width: 360px !important;
  margin: 0 !important;
  padding: 0 !important;
  color: #5b4635 !important;
  font-size: 0.94rem !important;
  line-height: 1.85 !important;
  position: static !important;
  transform: none !important;
  float: none !important;
  clear: both !important;
  text-align: left !important;
}

/* Extra protection from older footer styles */
footer.kaw-footer-clean .kaw-footer-brand *,
.kaw-footer-clean .kaw-footer-brand * {
  box-sizing: border-box !important;
}

footer.kaw-footer-clean .kaw-footer-brand a,
.kaw-footer-clean .kaw-footer-brand a {
  text-decoration: none !important;
}

/* Mobile */
@media (max-width: 640px) {
  footer.kaw-footer-clean .kaw-footer-brand,
  .kaw-footer-clean .kaw-footer-brand {
    max-width: 100% !important;
    gap: 16px !important;
  }

  footer.kaw-footer-clean .kaw-footer-logo-row,
  .kaw-footer-clean .kaw-footer-logo-row {
    grid-template-columns: 64px minmax(0, 1fr) !important;
    gap: 14px !important;
  }

  footer.kaw-footer-clean .kaw-footer-logo-row img,
  .kaw-footer-clean .kaw-footer-logo-row img {
    width: 64px !important;
    height: 64px !important;
    max-width: 64px !important;
    max-height: 64px !important;
  }

  footer.kaw-footer-clean .kaw-footer-brand-title span,
  .kaw-footer-clean .kaw-footer-brand-title span {
    max-width: 240px !important;
  }

  footer.kaw-footer-clean .kaw-footer-desc,
  .kaw-footer-clean .kaw-footer-desc {
    max-width: 100% !important;
  }
}
CSS

python3 - <<'PY'
from pathlib import Path
import re, time

ver = "footer-brand-overlap-" + str(int(time.time()))
pages = ["index.html", "shop.html", "product.html", "checkout.html"]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")

    text = re.sub(
        r'\s*<link rel="stylesheet" href="\./css/kawthar-footer-brand-overlap-fix\.css\?v=[^"]*" />',
        '',
        text
    )

    if "</head>" in text:
        text = text.replace(
            "</head>",
            f'  <link rel="stylesheet" href="./css/kawthar-footer-brand-overlap-fix.css?v={ver}" />\n</head>',
            1
        )

    p.write_text(text, encoding="utf-8")

print("Footer brand overlap fix linked:", ver)
PY

echo "=== VERIFY ==="
grep -n "kawthar-footer-brand-overlap-fix" index.html shop.html product.html checkout.html || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/index.html?v=$STAMP"
