(function () {
  "use strict";

  const WA = "201034110499";
  const IG = "https://www.instagram.com/kawthareg_/";
  const FB = "https://www.facebook.com/groups/1123525308506342/";

  function updateLinks() {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const text = (a.textContent || "").toLowerCase();

      if (href.includes("instagram.com") || text.includes("instagram")) {
        a.href = IG;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("facebook.com") || text.includes("facebook")) {
        a.href = FB;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("wa.me") || href.includes("whatsapp") || text.includes("whatsapp")) {
        const msg = "Hi KAWTHAR, I would like to ask about your products.";
        a.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }
    });
  }

  function updateFooterText() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.innerHTML = footer.innerHTML
      .replace(/Online payment gateway is being prepared for card and wallet payments\./gi, "Manual payment via InstaPay. Confirmation is completed on WhatsApp after the transfer screenshot.")
      .replace(/Card payment soon/gi, "InstaPay confirmation")
      .replace(/Mobile wallet soon/gi, "WhatsApp support");
  }

  function injectFooterSocial() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    if (footer.querySelector(".kaw-footer-social-final")) return;

    const target =
      Array.from(footer.querySelectorAll("div, section, nav, ul"))
        .find((el) => (el.textContent || "").toLowerCase().includes("contact")) ||
      footer;

    const box = document.createElement("div");
    box.className = "kaw-footer-social-final";
    box.innerHTML = `
      <a class="kaw-footer-social-chip is-whatsapp" href="https://wa.me/${WA}?text=${encodeURIComponent("Hi KAWTHAR, I would like to ask about your products.")}" target="_blank" rel="noreferrer noopener">
        <span class="kaw-footer-social-icon">W</span>
        <span class="kaw-footer-social-text"><strong>WhatsApp</strong><span>Direct inquiry</span></span>
      </a>

      <a class="kaw-footer-social-chip is-instagram" href="${IG}" target="_blank" rel="noreferrer noopener">
        <span class="kaw-footer-social-icon">IG</span>
        <span class="kaw-footer-social-text"><strong>Instagram</strong><span>@kawthareg_</span></span>
      </a>

      <a class="kaw-footer-social-chip is-facebook" href="${FB}" target="_blank" rel="noreferrer noopener">
        <span class="kaw-footer-social-icon">f</span>
        <span class="kaw-footer-social-text"><strong>Facebook</strong><span>KAWTHAR group</span></span>
      </a>
    `;

    target.appendChild(box);
  }

  function run() {
    updateFooterText();
    updateLinks();
    injectFooterSocial();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 500);
  setTimeout(run, 1500);

  console.info("KAWTHAR footer social final active.");
})();
