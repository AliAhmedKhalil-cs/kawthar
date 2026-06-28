(function () {
  "use strict";

  const WA_NUMBER = "201034110499";
  const IG_URL = "https://www.instagram.com/kawthareg_/";
  const FB_URL = "https://www.facebook.com/groups/1123525308506342/";

  function waUrl() {
    const msg = "Hi KAWTHAR, I would like to ask about your products.";
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function getLogoSrc() {
    const imgs = Array.from(document.querySelectorAll("img"));
    const logo = imgs.find((img) => {
      const data = [
        img.getAttribute("src") || "",
        img.getAttribute("alt") || "",
        img.getAttribute("class") || ""
      ].join(" ").toLowerCase();

      return data.includes("logo") || data.includes("kawthar");
    });

    return logo?.getAttribute("src") || "./assets/logo/kawthar-logo-hd.webp";
  }

  function footerHTML() {
    const logo = getLogoSrc();

    return `
      <div class="kaw-footer-container">
        <div class="kaw-footer-grid">
          <div class="kaw-footer-brand">
            <a class="kaw-footer-logo-row" href="./index.html" aria-label="KAWTHAR Home">
              <img src="${logo}" alt="KAWTHAR Logo" loading="lazy" decoding="async">
              <span class="kaw-footer-brand-title">
                <strong>KAWTHAR</strong>
                <span>Accessories & Artisan Bags</span>
              </span>
            </a>

            <p class="kaw-footer-desc">
              Premium stainless steel anti-rust accessories and handmade artisan bags curated for a soft feminine luxury style.
            </p>
          </div>

          <div class="kaw-footer-col">
            <h3>Shop</h3>
            <ul class="kaw-footer-list">
              <li><a href="./shop.html">All products</a></li>
              <li><a href="./index.html#collections">Collections</a></li>
              <li><a href="./index.html#featured">Featured pieces</a></li>
            </ul>
          </div>

          <div class="kaw-footer-col">
            <h3>Order</h3>
            <ul class="kaw-footer-list">
              <li><a href="./checkout.html">Checkout</a></li>
              <li><span>InstaPay confirmation</span></li>
              <li><span>WhatsApp support</span></li>
            </ul>
          </div>

          <div class="kaw-footer-col">
            <h3>Contact</h3>

            <div class="kaw-footer-contact-stack">
              <a class="kaw-footer-social wa" href="${waUrl()}" target="_blank" rel="noreferrer noopener" aria-label="Contact KAWTHAR on WhatsApp">
                <span class="kaw-footer-social-icon">W</span>
                <span class="kaw-footer-social-copy">
                  <strong>WhatsApp</strong>
                  <span>Direct inquiry</span>
                </span>
              </a>

              <a class="kaw-footer-social ig" href="${IG_URL}" target="_blank" rel="noreferrer noopener" aria-label="Open KAWTHAR Instagram">
                <span class="kaw-footer-social-icon">IG</span>
                <span class="kaw-footer-social-copy">
                  <strong>Instagram</strong>
                  <span>@kawthareg_</span>
                </span>
              </a>

              <a class="kaw-footer-social fb" href="${FB_URL}" target="_blank" rel="noreferrer noopener" aria-label="Open KAWTHAR Facebook group">
                <span class="kaw-footer-social-icon">f</span>
                <span class="kaw-footer-social-copy">
                  <strong>Facebook</strong>
                  <span>KAWTHAR group</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div class="kaw-footer-bottom">
          <span>© KAWTHAR Accessories</span>
          <span class="kaw-footer-bottom-note">Premium accessories. Direct ordering through WhatsApp.</span>
        </div>
      </div>
    `;
  }

  function normalizeLinks() {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const text = (a.textContent || "").toLowerCase();

      if (href.includes("instagram.com") || text.includes("instagram")) {
        a.href = IG_URL;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("facebook.com") || text.includes("facebook")) {
        a.href = FB_URL;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }

      if (href.includes("wa.me") || href.includes("whatsapp") || text.includes("whatsapp")) {
        a.href = waUrl();
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }
    });
  }

  function rebuildFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    if (footer.dataset.kawFooterFinalClean === "1") {
      normalizeLinks();
      return;
    }

    footer.dataset.kawFooterFinalClean = "1";
    footer.className = "kaw-footer-clean";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = footerHTML();

    normalizeLinks();
  }

  let timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(rebuildFooter, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", rebuildFooter);
  } else {
    rebuildFooter();
  }

  setTimeout(rebuildFooter, 300);
  setTimeout(rebuildFooter, 1200);
  setTimeout(rebuildFooter, 2600);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  console.info("KAWTHAR footer final clean active.");
})();
