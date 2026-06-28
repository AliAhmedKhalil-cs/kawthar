(function () {
  "use strict";

  const WA_NUMBER = "201034110499";
  const IG_URL = "https://www.instagram.com/kawthareg_/";
  const FB_URL = "https://www.facebook.com/groups/1123525308506342/";

  function waUrl() {
    const msg = "Hi KAWTHAR, I would like to ask about your products.";
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function socialHTML() {
    return `
      <div class="kaw-footer-contact-social" aria-label="KAWTHAR social links">
        <a class="wa" href="${waUrl()}" target="_blank" rel="noreferrer noopener" aria-label="Contact KAWTHAR on WhatsApp">
          <span class="social-icon">W</span>
          <span class="social-copy">
            <strong>WhatsApp</strong>
            <span>Direct inquiry</span>
          </span>
        </a>

        <a class="ig" href="${IG_URL}" target="_blank" rel="noreferrer noopener" aria-label="Open KAWTHAR Instagram">
          <span class="social-icon">IG</span>
          <span class="social-copy">
            <strong>Instagram</strong>
            <span>@kawthareg_</span>
          </span>
        </a>

        <a class="fb" href="${FB_URL}" target="_blank" rel="noreferrer noopener" aria-label="Open KAWTHAR Facebook group">
          <span class="social-icon">f</span>
          <span class="social-copy">
            <strong>Facebook</strong>
            <span>KAWTHAR group</span>
          </span>
        </a>
      </div>
    `;
  }

  function textOf(el) {
    return (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function findContactColumn(footer) {
    const headings = Array.from(footer.querySelectorAll("h1,h2,h3,h4,h5,h6,strong,b,span,div"));
    const contactHeading = headings.find((el) => textOf(el) === "contact");

    if (!contactHeading) return footer;

    const classTargets = [
      ".kaw-final-col",
      ".footer-col",
      ".footer-column",
      ".cin-footer__col",
      "[class*='footer'][class*='col']",
      "[class*='col']"
    ];

    for (const selector of classTargets) {
      const found = contactHeading.closest(selector);
      if (found && footer.contains(found)) return found;
    }

    return contactHeading.parentElement || footer;
  }

  function removeOldSocialBlocks(footer) {
    footer.querySelectorAll(".kaw-footer-social-final, .kaw-social-link, .kaw-footer-contact-social").forEach((el) => {
      el.remove();
    });
  }

  function removePlainSocialText(contactCol) {
    const socialWords = ["whatsapp", "instagram", "facebook"];

    const nodes = Array.from(contactCol.querySelectorAll("a, li, p, span, strong, b, div"));

    nodes.forEach((el) => {
      if (el.closest(".kaw-footer-contact-social")) return;

      const t = textOf(el);
      if (!t) return;

      const isPlainSocial =
        socialWords.includes(t) ||
        t === "@kawthareg_" ||
        t.includes("instagram @kawthareg_") ||
        t.includes("facebook kawthar") ||
        t.includes("whatsapp direct");

      const isSmallSocialLine =
        t.length <= 45 &&
        socialWords.some((word) => t.includes(word));

      if (!isPlainSocial && !isSmallSocialLine) return;

      const parent = el.parentElement;

      if (parent && ["LI", "P"].includes(parent.tagName)) {
        parent.remove();
        return;
      }

      el.remove();
    });
  }

  function normalizeLinks() {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const txt = textOf(a);

      if (href.includes("instagram.com") || txt.includes("instagram")) {
        a.href = IG_URL;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("facebook.com") || txt.includes("facebook")) {
        a.href = FB_URL;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("wa.me") || href.includes("whatsapp") || txt.includes("whatsapp")) {
        a.href = waUrl();
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }
    });
  }

  function injectContactSocial(contactCol) {
    if (!contactCol) return;

    const heading = Array.from(contactCol.querySelectorAll("h1,h2,h3,h4,h5,h6,strong,b,span,div"))
      .find((el) => textOf(el) === "contact");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = socialHTML().trim();
    const social = wrapper.firstElementChild;

    if (heading && heading.parentElement === contactCol) {
      heading.insertAdjacentElement("afterend", social);
      return;
    }

    const firstHeading = contactCol.querySelector("h1,h2,h3,h4,h5,h6");
    if (firstHeading) {
      firstHeading.insertAdjacentElement("afterend", social);
      return;
    }

    contactCol.appendChild(social);
  }

  function cleanFooterText() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.innerHTML = footer.innerHTML
      .replace(/Online payment gateway is being prepared for card and wallet payments\./gi, "Manual payment via InstaPay. Confirmation is completed on WhatsApp after the transfer screenshot.")
      .replace(/Card payment soon/gi, "InstaPay confirmation")
      .replace(/Mobile wallet soon/gi, "WhatsApp support");
  }

  function run() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    cleanFooterText();

    const contactCol = findContactColumn(footer);

    removeOldSocialBlocks(footer);
    removePlainSocialText(contactCol);
    injectContactSocial(contactCol);
    normalizeLinks();
  }

  let timer = null;
  function scheduleRun() {
    clearTimeout(timer);
    timer = setTimeout(run, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 400);
  setTimeout(run, 1200);
  setTimeout(run, 2400);

  const observer = new MutationObserver(scheduleRun);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR footer contact social clean active.");
})();
