#!/usr/bin/env bash
set -e

echo "=== REMOVE VISIBLE BACKSLASH-N TEXT ==="

STAMP="$(date +%F-%H%M%S)"
mkdir -p backups js

tar -czf "backups/backup-before-remove-visible-backslash-n-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html js 2>/dev/null || true

python3 - <<'PY'
from pathlib import Path
import re, time

pages = ["index.html", "shop.html", "product.html", "checkout.html"]
ver = "remove-visible-n-" + str(int(time.time()))

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")

    # Remove literal visible \n near body/script injection points only
    text = text.replace("\\n</body>", "</body>")
    text = text.replace("\\n</html>", "</html>")
    text = text.replace("\\n<script", "<script")
    text = text.replace("\\n  <script", "  <script")
    text = text.replace(">\\n", ">")

    # Remove old link if exists
    text = re.sub(
        r'\s*<script src="\./js/kawthar-remove-visible-n\.js\?v=[^"]*"></script>',
        "",
        text
    )

    if "</body>" in text:
        text = text.replace(
            "</body>",
            f'  <script src="./js/kawthar-remove-visible-n.js?v={ver}"></script>\n</body>',
            1
        )

    p.write_text(text, encoding="utf-8")

print("Static visible \\n cleanup done:", ver)
PY

cat > js/kawthar-remove-visible-n.js <<'JS'
(function () {
  "use strict";

  function removeVisibleBackslashN() {
    if (!document.body) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.nodeValue || "";
      const cleaned = value.trim();

      if (
        cleaned === "\\n" ||
        cleaned === "\\n\\n" ||
        cleaned === "\\n\\n\\n"
      ) {
        nodes.push(node);
      }
    }

    nodes.forEach((node) => {
      node.parentNode && node.parentNode.removeChild(node);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeVisibleBackslashN);
  } else {
    removeVisibleBackslashN();
  }

  setTimeout(removeVisibleBackslashN, 300);
  setTimeout(removeVisibleBackslashN, 1200);
  setTimeout(removeVisibleBackslashN, 2600);

  const observer = new MutationObserver(removeVisibleBackslashN);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR visible backslash-n remover active.");
})();
JS

if command -v node >/dev/null 2>&1; then
  node --check js/kawthar-remove-visible-n.js
fi

echo "=== VERIFY STATIC OCCURRENCES ==="
grep -n '\\\\n' index.html shop.html product.html checkout.html | head -30 || true

echo "=== DONE ==="
echo "Open:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/index.html?v=$STAMP"
