#!/usr/bin/env bash
set -e

echo "=== UPDATE KAWTHAR INSTAPAY ALIAS ==="

OLD="kawthar@instapay"
NEW="kawtharabdo@instapay"
STAMP="$(date +%F-%H%M%S)"

mkdir -p backups

tar -czf "backups/backup-before-instapay-alias-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

echo "Backup created: backups/backup-before-instapay-alias-$STAMP.tar.gz"

echo "Replacing alias in HTML/CSS/JS files..."

find . \
  \( -path "./backups" -o -path "./node_modules" -o -path "./payment-server/node_modules" \) -prune -o \
  -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.env" \) \
  -print0 | xargs -0 perl -pi -e "s/\Q$OLD\E/$NEW/g"

echo "Updating cache versions..."

python3 - <<'PY'
from pathlib import Path
import re, time

ver = "instapay-" + str(int(time.time()))
pages = ["index.html", "shop.html", "product.html", "checkout.html"]

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8")

    # Update CSS/JS query versions so browser does not keep old files
    text = re.sub(r'(\.css\?v=)[^"]+', r'\1' + ver, text)
    text = re.sub(r'(\.js\?v=)[^"]+', r'\1' + ver, text)

    p.write_text(text, encoding="utf-8")

print("Cache versions updated:", ver)
PY

if command -v node >/dev/null 2>&1; then
  echo "Checking JS syntax..."
  find js -maxdepth 1 -type f -name "*.js" -print0 | while IFS= read -r -d '' file; do
    node --check "$file" >/dev/null
  done
fi

echo "Checking remaining old alias..."
if grep -R "kawthar@instapay" -n index.html shop.html product.html checkout.html css js 2>/dev/null; then
  echo "WARNING: old alias still exists in files above."
else
  echo "OK: old alias removed."
fi

echo "Checking new alias..."
grep -R "kawtharabdo@instapay" -n checkout.html js css | head -20 || true

echo "=== DONE ==="
echo "Open checkout with:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/checkout.html?v=$STAMP"
