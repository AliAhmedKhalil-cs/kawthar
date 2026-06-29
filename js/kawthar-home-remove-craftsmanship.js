(function () {
  "use strict";

  if (!/\/$|index\.html/i.test(location.pathname)) return;

  function norm(text) {
    return (text || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function safeBlock(el) {
    if (!el) return null;
    if (el === document.body || el === document.documentElement) return null;
    if (el.closest("header") || el.closest("footer")) return null;

    const section = el.closest("section");
    if (section && !section.closest("header") && !section.closest("footer")) {
      return section;
    }

    let node = el;
    let best = el;

    while (node && node.parentElement && node.parentElement !== document.body) {
      const parent = node.parentElement;
      if (parent.closest("header") || parent.closest("footer")) break;

      const txt = norm(parent.textContent);
      const r = parent.getBoundingClientRect();

      if (r.height > 220 && txt.length < 3000) {
        best = parent;
      }

      if (parent.tagName && parent.tagName.toLowerCase() === "main") break;
      node = parent;
    }

    return best;
  }

  function removeCraftsmanshipBlock() {
    document.body.classList.add("kaw-remove-craftsmanship");

    const all = Array.from(document.querySelectorAll("main section, section, main > div, div, h1, h2, h3, p, span"));

    all.forEach((el) => {
      if (el.closest("header") || el.closest("footer")) return;

      const text = norm(el.textContent);

      const isCraftBlock =
        text.includes("where artistry meets precision") ||
        text.includes("craftsmanship") ||
        text.includes("each kawthar piece is born") ||
        text.includes("philosophy of restraint") ||
        text.includes("our stainless steel is chosen") ||
        (
          text.includes("100%") &&
          text.includes("stainless steel") &&
          text.includes("wear life")
        ) ||
        (
          text.includes("rust. ever") &&
          text.includes("view full shop")
        );

      if (isCraftBlock) {
        const block = safeBlock(el);
        if (block) {
          block.classList.add("kaw-craftsmanship-remove");
          block.setAttribute("data-kaw-removed", "craftsmanship-story");
        }
      }
    });

    removeEmptyGaps();
  }

  function removeEmptyGaps() {
    document.querySelectorAll("main > div, main > section, section").forEach((el) => {
      if (el.closest("header") || el.closest("footer")) return;
      if (el.classList.contains("kaw-craftsmanship-remove")) return;

      const text = norm(el.textContent);
      const r = el.getBoundingClientRect();

      if (text.length < 8 && r.height > 80) {
        el.classList.add("kaw-craftsmanship-gap");
      }
    });
  }

  function run() {
    removeCraftsmanshipBlock();
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

  const observer = new MutationObserver(() => {
    clearTimeout(window.__kawCraftTimer);
    window.__kawCraftTimer = setTimeout(run, 120);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  console.info("KAWTHAR craftsmanship block removed.");
})();
