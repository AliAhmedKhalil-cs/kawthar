(function () {
  "use strict";

  const LOGO_SRC = "./assets/logo/kawthar-logo-hd.webp?v=logo-1782681526";

  function looksLikeLogo(img) {
    const data = [
      img.getAttribute("alt") || "",
      img.getAttribute("class") || "",
      img.getAttribute("id") || "",
      img.getAttribute("src") || ""
    ].join(" ").toLowerCase();

    return data.includes("logo") || data.includes("kawthar") || data.includes("brand");
  }

  function fixOne(img) {
    if (!looksLikeLogo(img)) return;

    const src = img.getAttribute("src") || "";
    const broken = img.complete && img.naturalWidth === 0;

    if (!src || broken || src.includes("kawthar-logo-hd.webp")) {
      img.setAttribute("src", LOGO_SRC);
      img.setAttribute("alt", img.getAttribute("alt") || "Kawthar Logo");
      img.style.objectFit = "contain";
    }

    if (!img.dataset.kawLogoErrorBound) {
      img.dataset.kawLogoErrorBound = "1";
      img.addEventListener("error", function () {
        if (img.getAttribute("src") !== LOGO_SRC) {
          img.setAttribute("src", LOGO_SRC);
        }
      });
    }
  }

  function fixLogos() {
    document.querySelectorAll("img").forEach(fixOne);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixLogos);
  } else {
    fixLogos();
  }

  setTimeout(fixLogos, 300);
  setTimeout(fixLogos, 1000);
  setTimeout(fixLogos, 2500);

  console.info("KAWTHAR logo fix active:", LOGO_SRC);
})();
