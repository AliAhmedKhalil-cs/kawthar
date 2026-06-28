(function () {
  "use strict";

  if (!/product\.html/i.test(location.pathname)) return;

  function isLogoOrIcon(img) {
    const data = [
      img.getAttribute("src") || "",
      img.getAttribute("alt") || "",
      img.getAttribute("class") || "",
      img.getAttribute("id") || ""
    ].join(" ").toLowerCase();

    return (
      data.includes("logo") ||
      data.includes("icon") ||
      data.includes("whatsapp") ||
      data.includes("facebook") ||
      data.includes("instagram")
    );
  }

  function moveFooterOutOfShell() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    if (footer.parentElement !== document.body) {
      document.body.appendChild(footer);
    }
  }

  function removeVisibleNewlineText() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = (node.nodeValue || "").trim();

      if (value === "\\n" || value === "\\n\\n") {
        nodes.push(node);
      }
    }

    nodes.forEach((node) => {
      const span = document.createElement("span");
      span.className = "kaw-visible-newline-cleaned";
      node.parentNode && node.parentNode.replaceChild(span, node);
    });
  }

  function capOversizedProductImages() {
    const imgs = Array.from(document.querySelectorAll("img")).filter((img) => {
      if (isLogoOrIcon(img)) return false;
      if (img.closest("header")) return false;
      if (img.closest("footer")) return false;
      if (img.closest(".cart-drawer")) return false;
      if (img.closest("[class*='drawer']")) return false;

      const r = img.getBoundingClientRect();
      return r.width > 420 || r.height > 360;
    });

    imgs.forEach((img) => {
      img.classList.add("kaw-product-media-img-cap");

      let node = img.parentElement;
      let best = node;

      for (let i = 0; i < 4 && node && node !== document.body; i++) {
        const text = (node.textContent || "").trim();
        const r = node.getBoundingClientRect();

        if (text.length < 320 && r.width >= img.getBoundingClientRect().width * 0.75) {
          best = node;
        }

        node = node.parentElement;
      }

      if (best) best.classList.add("kaw-product-media-wrap-cap");
    });
  }

  function compactRelatedArea() {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,.section-title,[class*='title']"))
      .filter((el) => {
        const t = (el.textContent || "").toLowerCase();
        return t.includes("you may also like") || t.includes("related");
      });

    headings.forEach((heading) => {
      let node = heading.parentElement;

      for (let i = 0; i < 5 && node && node !== document.body; i++) {
        const t = (node.textContent || "").toLowerCase();

        if (t.includes("you may also like") || t.includes("related")) {
          node.classList.add("kaw-related-compact");
          break;
        }

        node = node.parentElement;
      }
    });
  }

  function markImagesNearFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const footerTop = footer.getBoundingClientRect().top + window.scrollY;

    document.querySelectorAll("img").forEach((img) => {
      if (isLogoOrIcon(img)) return;

      const top = img.getBoundingClientRect().top + window.scrollY;

      if (top > footerTop - 900 && top < footerTop + 80) {
        img.classList.add("kaw-product-near-footer");
      }
    });
  }

  function run() {
    document.body.classList.add("kaw-pf-guard");

    moveFooterOutOfShell();
    removeVisibleNewlineText();
    compactRelatedArea();
    capOversizedProductImages();
    markImagesNearFooter();
  }

  let timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 350);
  setTimeout(run, 1000);
  setTimeout(run, 2200);
  setTimeout(run, 3800);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR product footer/media guard active.");
})();
