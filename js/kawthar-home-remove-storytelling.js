(function () {
  "use strict";

  if (!/\/$|index\.html/i.test(location.pathname)) return;

  function norm(text) {
    return (text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function isBadAncestor(el) {
    return !el || el === document.body || el === document.documentElement || el.closest("header") || el.closest("footer");
  }

  function topContentBlock(el) {
    if (!el || isBadAncestor(el)) return null;

    const section = el.closest("section");
    if (section && !isBadAncestor(section)) return section;

    let node = el;
    let lastGood = el;

    while (node && node.parentElement && !isBadAncestor(node.parentElement)) {
      const parent = node.parentElement;
      const parentTag = parent.tagName.toLowerCase();

      if (parentTag === "main") break;

      const r = parent.getBoundingClientRect();
      const text = norm(parent.textContent);

      if (r.height > 160 && text.length < 2500) {
        lastGood = parent;
      }

      node = parent;
    }

    return lastGood;
  }

  function markRemove(el, reason) {
    if (!el || isBadAncestor(el)) return;

    el.classList.add("kaw-client-remove-block");
    el.setAttribute("data-kaw-removed-reason", reason);
  }

  function hideByHeadingText() {
    const elements = Array.from(document.querySelectorAll("section, div, h1, h2, h3, h4, p, span"));

    elements.forEach((el) => {
      if (el.closest("header") || el.closest("footer")) return;

      const text = norm(el.textContent);

      const isMaterial =
        text.includes("built to last") ||
        text.includes("designed to dazzle") ||
        text.includes("the material");

      const isCollectionStory =
        text.includes("artisan crafts") ||
        text.includes("royal selection") ||
        (
          text.includes("signature line") &&
          text.includes("bracelets")
        ) ||
        (
          text.includes("daily luxury") &&
          text.includes("bracelets")
        );

      if (isMaterial) {
        markRemove(topContentBlock(el), "material-storytelling");
      }

      if (isCollectionStory) {
        markRemove(topContentBlock(el), "collection-storytelling");
      }
    });
  }

  function hideMaterialGridByCombinedText() {
    const candidates = Array.from(document.querySelectorAll("main section, section, main > div, .section, [class*='section'], [class*='material'], [class*='collection']"));

    candidates.forEach((el) => {
      if (el.closest("header") || el.closest("footer")) return;

      const text = norm(el.textContent);

      const materialScore =
        text.includes("stainless steel") &&
        text.includes("waterproof") &&
        text.includes("anti rust") &&
        text.includes("premium quality");

      const collectionScore =
        text.includes("artisan crafts") &&
        text.includes("royal selection");

      if (materialScore) {
        markRemove(el, "material-cards");
      }

      if (collectionScore) {
        markRemove(el, "collection-mosaic");
      }
    });
  }

  function hideNavItems() {
    document.querySelectorAll("header a, nav a, .nav a").forEach((a) => {
      const text = norm(a.textContent);
      const href = norm(a.getAttribute("href") || "");

      if (
        text === "story" ||
        text === "collections" ||
        href.includes("#story") ||
        href.includes("#collections")
      ) {
        a.classList.add("kaw-client-hide-nav");
      }
    });
  }

  function markNextProductSection() {
    const sections = Array.from(document.querySelectorAll("main section, section"))
      .filter((sec) => !sec.closest("header") && !sec.closest("footer") && !sec.classList.contains("kaw-client-remove-block"));

    const productLike = sections.find((sec) => {
      const text = norm(sec.textContent.slice(0, 700));
      return (
        text.includes("featured") ||
        text.includes("shop") ||
        text.includes("products") ||
        sec.querySelector("a[href*='product.html']") ||
        sec.querySelector(".product-card")
      );
    });

    if (productLike) {
      productLike.classList.add("kaw-client-products-priority");
    }
  }

  function removeEmptyGaps() {
    document.querySelectorAll("main > div, main > section, section").forEach((el) => {
      if (el.closest("header") || el.closest("footer")) return;
      if (el.classList.contains("kaw-client-remove-block")) return;

      const text = norm(el.textContent);
      const r = el.getBoundingClientRect();

      if (text.length < 5 && r.height > 80) {
        el.classList.add("kaw-client-empty-gap");
      }
    });
  }

  function run() {
    document.body.classList.add("kaw-home-client-cut");

    hideNavItems();
    hideByHeadingText();
    hideMaterialGridByCombinedText();
    markNextProductSection();
    removeEmptyGaps();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 250);
  setTimeout(run, 900);
  setTimeout(run, 1800);

  console.info("KAWTHAR homepage storytelling blocks removed.");
})();
