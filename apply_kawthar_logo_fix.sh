#!/usr/bin/env bash
set -e

echo "=== KAWTHAR LOGO RESTORE FIX ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups js css

tar -czf "backups/backup-before-logo-fix-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js assets 2>/dev/null || true

echo "Backup created: backups/backup-before-logo-fix-$STAMP.tar.gz"

python3 - <<'PY'
from pathlib import Path
import re
import sys
import time

root = Path(".")
stamp = str(int(time.time()))

ignore_parts = {"backups", "node_modules", ".git", "payment-server"}
exts = {".webp", ".png", ".jpg", ".jpeg", ".svg"}

imgs = []
for p in root.rglob("*"):
    if not p.is_file():
        continue
    if any(part in ignore_parts for part in p.parts):
        continue
    if p.suffix.lower() not in exts:
        continue
    if p.stat().st_size < 50:
        continue
    imgs.append(p)

def score(p: Path):
    s = p.as_posix().lower()
    points = 0
    if "logo" in s:
        points += 100
    if "kawthar" in s or "kawther" in s or "kawthar" in s:
        points += 80
    if "assets/logo" in s:
        points += 40
    if p.suffix.lower() == ".webp":
        points += 15
    if "hd" in s:
        points += 10
    if "old" in s or "backup" in s:
        points -= 50
    return points

candidates = sorted(imgs, key=score, reverse=True)
candidates = [p for p in candidates if score(p) > 0]

if not candidates:
    print("ERROR: No logo-like image found.")
    print("Available images:")
    for p in imgs[:80]:
        print(" -", p.as_posix())
    sys.exit(1)

logo = candidates[0]
logo_rel = "./" + logo.as_posix().lstrip("./")
logo_url = f"{logo_rel}?v=logo-{stamp}"

print("Selected logo:", logo_rel)

# Patch HTML and JS references only. Avoid CSS path issues.
files = []
for pattern in ["*.html", "js/*.js"]:
    files.extend(root.glob(pattern))

src_attr_re = re.compile(
    r'(src=["\'])([^"\']*(?:logo|kawthar|kawther)[^"\']*\.(?:webp|png|jpe?g|svg)(?:\?v=[^"\']*)?)(["\'])',
    re.I
)

js_string_img_re = re.compile(
    r'(["\'])([^"\']*(?:logo|kawthar|kawther)[^"\']*\.(?:webp|png|jpe?g|svg)(?:\?v=[^"\']*)?)\1',
    re.I
)

specific_paths_re = re.compile(
    r'(\./)?assets/logo/kawthar-logo-hd\.(?:webp|png|jpe?g|svg)(?:\?v=[^"\']*)?',
    re.I
)

for p in files:
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")
    old = text

    text = specific_paths_re.sub(logo_url, text)
    text = src_attr_re.sub(lambda m: m.group(1) + logo_url + m.group(3), text)

    if p.suffix.lower() == ".js":
        text = js_string_img_re.sub(lambda m: m.group(1) + logo_url + m.group(1), text)

    if text != old:
        p.write_text(text, encoding="utf-8")
        print("Patched:", p.as_posix())

# Add runtime fallback in case any JS rebuilds the header after load.
fallback_js = f'''(function () {{
  "use strict";

  const LOGO_SRC = "{logo_url}";

  function looksLikeLogo(img) {{
    const data = [
      img.getAttribute("alt") || "",
      img.getAttribute("class") || "",
      img.getAttribute("id") || "",
      img.getAttribute("src") || ""
    ].join(" ").toLowerCase();

    return data.includes("logo") || data.includes("kawthar") || data.includes("brand");
  }}

  function fixOne(img) {{
    if (!looksLikeLogo(img)) return;

    const src = img.getAttribute("src") || "";
    const broken = img.complete && img.naturalWidth === 0;

    if (!src || broken || src.includes("kawthar-logo-hd.webp")) {{
      img.setAttribute("src", LOGO_SRC);
      img.setAttribute("alt", img.getAttribute("alt") || "Kawthar Logo");
      img.style.objectFit = "contain";
    }}

    if (!img.dataset.kawLogoErrorBound) {{
      img.dataset.kawLogoErrorBound = "1";
      img.addEventListener("error", function () {{
        if (img.getAttribute("src") !== LOGO_SRC) {{
          img.setAttribute("src", LOGO_SRC);
        }}
      }});
    }}
  }}

  function fixLogos() {{
    document.querySelectorAll("img").forEach(fixOne);
  }}

  if (document.readyState === "loading") {{
    document.addEventListener("DOMContentLoaded", fixLogos);
  }} else {{
    fixLogos();
  }}

  setTimeout(fixLogos, 300);
  setTimeout(fixLogos, 1000);
  setTimeout(fixLogos, 2500);

  console.info("KAWTHAR logo fix active:", LOGO_SRC);
}})();
'''

Path("js/kawthar-logo-fix.js").write_text(fallback_js, encoding="utf-8")

pages = ["index.html", "shop.html", "product.html", "checkout.html"]
for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")
    text = re.sub(
        r'\s*<script src="\./js/kawthar-logo-fix\.js\?v=[^"]*"></script>',
        "",
        text
    )

    text = text.replace(
        "</body>",
        f'  <script src="./js/kawthar-logo-fix.js?v=logo-{stamp}"></script>\\n</body>',
        1
    )

    p.write_text(text, encoding="utf-8")

print("Runtime logo fallback linked.")
print("LOGO_PATH=" + logo_rel)
PY

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-logo-fix.js
fi

echo "=== Logo references now ==="
grep -R "kawthar-logo-fix\|Kawthar Logo\|logo" -n index.html shop.html product.html checkout.html js/kawthar-logo-fix.js | head -60 || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/index.html?v=logo-fix-$STAMP"
