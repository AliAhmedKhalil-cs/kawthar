(function () {
  "use strict";

  const IS_PRODUCT = /product\.html/i.test(location.pathname);

  function clearRecentStorage() {
    try {
      Object.keys(localStorage).forEach((key) => {
        const k = key.toLowerCase();

        if (
          k.includes("recently") ||
          k.includes("recent_view") ||
          k.includes("recent-view") ||
          k.includes("viewed_products") ||
          k.includes("viewed-products")
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch {}
  }

  function text(el) {
    return (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function removeBySelector() {
    const selectors = [
      "#recentlyViewed",
      "#recentlyViewedWrap",
      "#recentlyViewedBar",
      "#recentProducts",
      "#recentlyProducts",
      ".recently-viewed",
      ".recentlyViewed",
      ".recently-products",
      ".recent-products",
      ".viewed-products",
      ".rv-strip",
      ".rv-bar",
      "[data-recently-viewed]",
      "[data-recent-products]",
      "[class*='recently-viewed']",
      "[class*='recentlyViewed']",
      "[class*='recent-products']",
      "[class*='recentProducts']"
    ];

    document.querySelectorAll(selectors.join(",")).forEach((el) => {
      el.remove();
    });
  }

  function removeRecentlyViewedByText() {
    const candidates = Array.from(document.querySelectorAll("section, aside, nav, div"));

    candidates
      .filter((el) => {
        const t = text(el);

        if (!t.includes("recently viewed")) return false;

        // Do not remove full drawer/body accidentally.
        if (t.includes("your selection") || t.includes("cart") || t.includes("checkout")) return false;
        if (el === document.body || el === document.documentElement) return false;

        return t.length < 1200;
      })
      .sort((a, b) => text(a).length - text(b).length)
      .forEach((el) => {
        if (document.body.contains(el)) el.remove();
      });
  }

  function looksLikeRealWhatsAppFloat(el) {
    const r = el.getBoundingClientRect();
    const t = text(el);
    const href = String(el.getAttribute("href") || "").toLowerCase();

    return (
      (href.includes("wa.me") || t === "" || t.includes("whatsapp")) &&
      r.width <= 90 &&
      r.height <= 90 &&
      r.right > window.innerWidth - 140 &&
      r.bottom > window.innerHeight - 160
    );
  }

  function removeOldProductStickyBars() {
    if (!IS_PRODUCT) return;

    document.body.classList.add("kaw-remove-product-sticky");

    const directSelectors = [
      "#stickyWaBar",
      ".sticky-wa-bar",
      ".sticky-product-bar",
      "[id*='stickyWa']",
      "[class*='sticky-wa']",
      "[class*='sticky-product']"
    ];

    document.querySelectorAll(directSelectors.join(",")).forEach((el) => {
      if (looksLikeRealWhatsAppFloat(el)) return;
      el.remove();
    });

    const candidates = Array.from(document.querySelectorAll("div, section, nav, aside, footer"));

    candidates.forEach((el) => {
      if (!document.body.contains(el)) return;
      if (el.closest("#kawProductUnifiedHeader")) return;
      if (looksLikeRealWhatsAppFloat(el)) return;

      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const t = text(el);

      const isWideBottomBar =
        (cs.position === "fixed" || cs.position === "sticky") &&
        r.width > Math.min(520, window.innerWidth * 0.45) &&
        r.height >= 36 &&
        r.height <= 180 &&
        r.bottom >= window.innerHeight - 170;

      const hasOldCtaText =
        t.includes("check on whatsapp") ||
        t.includes("order on whatsapp") ||
        t.includes("add to selection");

      const isMarkedOldBar =
        r.width > Math.min(520, window.innerWidth * 0.45) &&
        r.height >= 36 &&
        r.height <= 180 &&
        hasOldCtaText &&
        r.top > window.innerHeight * 0.55;

      if (isWideBottomBar || isMarkedOldBar) {
        el.remove();
      }
    });
  }

  function run() {
    clearRecentStorage();
    removeBySelector();
    removeRecentlyViewedByText();
    removeOldProductStickyBars();
  }

  let timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 250);
  setTimeout(run, 900);
  setTimeout(run, 1800);
  setTimeout(run, 3200);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR obstruction remover active.");
})();
