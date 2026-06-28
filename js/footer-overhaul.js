(function () {
  const footerHTML = `
    <div class="container kaw-final-grid">
      <div class="kaw-final-brand">
        <a class="kaw-final-logo" href="./index.html" aria-label="KAWTHAR Home">
          <img src="./assets/logo/kawthar-logo-hd.webp?v=logo-1782681526" alt="KAWTHAR Logo" loading="lazy" decoding="async">
          <span class="kaw-final-logo-text">
            <strong>KAWTHAR</strong>
            <span>Accessories & Artisan Bags</span>
          </span>
        </a>

        <p class="kaw-final-desc">
          Premium stainless steel anti-rust accessories and handmade artisan bags curated for a soft feminine luxury style.
        </p>

        <div class="kaw-final-badge">✦ Direct inquiry via WhatsApp</div>
      </div>

      <div class="kaw-final-col">
        <h3>Shop</h3>
        <ul class="kaw-final-list">
          <li><a href="./shop.html">All products</a></li>
          <li><a href="./index.html#collections">Collections</a></li>
          <li><a href="./index.html#featured">Featured pieces</a></li>
        </ul>
      </div>

      <div class="kaw-final-col">
        <h3>Order</h3>
        <ul class="kaw-final-list">
          <li><a href="./checkout.html">Checkout</a></li>
          <li><span>InstaPay / Meeza confirmation</span></li>
          <li><span>Fast WhatsApp support</span></li>
        </ul>
      </div>

      <div class="kaw-final-col">
        <h3>Contact</h3>
        <ul class="kaw-final-list">
          <li><a href="https://wa.me/201034110499" target="_blank" rel="noreferrer noopener">WhatsApp</a></li>
          <li><a href="https://www.instagram.com/kawthareg_/" target="_blank" rel="noreferrer noopener">Instagram</a></li>
          <li><span>Premium Stainless Steel & Artisan Bags</span></li>
        </ul>

        <div class="kaw-final-note">
          Payment is confirmed manually through WhatsApp after the customer sends the transfer screenshot.
        </div>
      </div>
    </div>

    <div class="container kaw-final-bottom">
      <span>© KAWTHAR Accessories</span>
      <span class="kaw-final-tags">
        <span>Anti Rust</span>
        <span>Waterproof</span>
        <span>Premium Quality</span>
      </span>
    </div>
  `;

  function replaceFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.className = "kaw-final-footer";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = footerHTML;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", replaceFooter);
  } else {
    replaceFooter();
  }
})();
