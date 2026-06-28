(function () {
  "use strict";

  if (!/product\.html/i.test(location.pathname)) return;

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 20 && rect.height > 20 && style.display !== "none" && style.visibility !== "hidden";
  }

  function isLogoOrIcon(img) {
    const src = (img.currentSrc || img.src || "").toLowerCase();
    const alt = (img.alt || "").toLowerCase();
    const cls = (img.className || "").toString().toLowerCase();

    return (
      src.includes("logo") ||
      alt.includes("logo") ||
      cls.includes("logo") ||
      src.includes("icon") ||
      cls.includes("icon") ||
      src.includes("whatsapp")
    );
  }

  function findLargestProductImage() {
    const imgs = Array.from(document.querySelectorAll("img")).filter((img) => {
      if (!isVisible(img)) return false;
      if (isLogoOrIcon(img)) return false;

      const rect = img.getBoundingClientRect();
      const area = rect.width * rect.height;

      return area > 45000 && rect.width > 220 && rect.height > 180;
    });

    if (!imgs.length) return null;

    imgs.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (br.width * br.height) - (ar.width * ar.height);
    });

    return imgs[0];
  }

  function findBestMediaWrapper(img) {
    if (!img) return null;

    let node = img.parentElement;
    let best = node;

    for (let i = 0; i < 5 && node && node !== document.body; i++) {
      const rect = node.getBoundingClientRect();
      const text = (node.textContent || "").trim();

      const goodBox =
        rect.width >= img.getBoundingClientRect().width * 0.8 &&
        rect.height >= img.getBoundingClientRect().height * 0.8 &&
        text.length < 220;

      if (goodBox) best = node;

      node = node.parentElement;
    }

    return best || img.parentElement;
  }

  function applyImageSizing() {
    document.body.classList.add("kaw-product-size-fixed");

    const img = findLargestProductImage();
    if (!img) return false;

    const wrapper = findBestMediaWrapper(img);

    img.classList.add("kaw-product-main-img");

    if (wrapper) {
      wrapper.classList.add("kaw-product-main-media");
    }

    return true;
  }

  function fixStickyBarSpacing() {
    const sticky =
      document.getElementById("stickyWaBar") ||
      document.querySelector(".sticky-wa-bar") ||
      document.querySelector(".sticky-product-bar") ||
      document.querySelector("[id*='stickyWa']") ||
      document.querySelector("[class*='sticky-wa']");

    if (!sticky) return;

    sticky.setAttribute("data-kaw-fixed", "true");

    const buttons = sticky.querySelectorAll("button, a");
    buttons.forEach((btn) => {
      btn.style.whiteSpace = "nowrap";
    });
  }

  function removeExtremeInlineSizes() {
    const img = document.querySelector(".kaw-product-main-img");
    if (!img) return;

    img.style.maxHeight = "none";
    img.style.maxWidth = "none";

    const wrapper = document.querySelector(".kaw-product-main-media");
    if (wrapper) {
      wrapper.style.maxWidth = "";
      wrapper.style.width = "";
    }
  }

  function run() {
    applyImageSizing();
    fixStickyBarSpacing();
    removeExtremeInlineSizes();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    run();

    if (document.querySelector(".kaw-product-main-img") || attempts >= 20) {
      clearInterval(timer);
    }
  }, 250);

  setTimeout(run, 1500);
  setTimeout(run, 3000);

  console.info("KAWTHAR product size fix loaded.");
})();
