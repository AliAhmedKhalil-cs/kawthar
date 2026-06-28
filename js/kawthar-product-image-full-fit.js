(function () {
  "use strict";

  if (!/product\.html/i.test(location.pathname)) return;

  function isLogoOrUiImage(img) {
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

  function imageUrl(img) {
    return img.currentSrc || img.src || img.getAttribute("src") || "";
  }

  function findMainProductImage() {
    const imgs = Array.from(document.querySelectorAll("img")).filter((img) => {
      if (isLogoOrUiImage(img)) return false;
      if (img.closest("header")) return false;
      if (img.closest("footer")) return false;
      if (img.closest("[class*='drawer']")) return false;
      if (img.closest("[class*='cart']")) return false;

      const r = img.getBoundingClientRect();
      return r.width > 220 && r.height > 160;
    });

    if (!imgs.length) return null;

    imgs.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();

      /*
        Prefer the visible image in the top product area.
        Avoid lower related products.
      */
      const aScore = ar.width * ar.height - Math.max(0, ar.top) * 85;
      const bScore = br.width * br.height - Math.max(0, br.top) * 85;

      return bScore - aScore;
    });

    return imgs[0];
  }

  function bestWrapperFor(img) {
    let node = img.parentElement;
    let best = node;

    for (let i = 0; i < 5 && node && node !== document.body; i++) {
      const r = node.getBoundingClientRect();
      const text = (node.textContent || "").trim();

      const good =
        r.width >= img.getBoundingClientRect().width * 0.75 &&
        r.height >= img.getBoundingClientRect().height * 0.60 &&
        text.length < 420;

      if (good) best = node;
      node = node.parentElement;
    }

    return best || img.parentElement;
  }

  function applyMainFit() {
    const img = findMainProductImage();
    if (!img) return;

    const wrap = bestWrapperFor(img);
    const url = imageUrl(img);

    document.body.classList.add("kaw-product-full-fit");

    img.classList.add("kaw-fit-product-img");

    if (wrap) {
      wrap.classList.add("kaw-fit-media-wrap");

      if (url) {
        wrap.style.setProperty("--kaw-product-bg", `url("${url}")`);
      }
    }
  }

  function markRelatedArea() {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,.section-title,[class*='title']")).filter((el) => {
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

  function forceContainOnProductImages() {
    document.querySelectorAll(".kaw-fit-product-img,.kaw-product-media-img-cap,.kaw-main-product-img").forEach((img) => {
      img.style.objectFit = "contain";
      img.style.objectPosition = "center center";
    });
  }

  function run() {
    document.body.classList.add("kaw-product-full-fit");
    applyMainFit();
    markRelatedArea();
    forceContainOnProductImages();
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

  setTimeout(run, 300);
  setTimeout(run, 900);
  setTimeout(run, 1800);
  setTimeout(run, 3200);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR product image full-fit active.");
})();
