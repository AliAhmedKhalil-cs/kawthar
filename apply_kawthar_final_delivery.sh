#!/usr/bin/env bash
set -e

echo "=== KAWTHAR FINAL DELIVERY POLISH PACK ==="

ROOT="$(pwd)"
STAMP="$(date +%F-%H%M%S)"

if [ ! -f "index.html" ]; then
  echo "ERROR: index.html not found. Run this script inside /var/www/kawthar-fixed"
  exit 1
fi

mkdir -p css js backups
tar -czf "backups/backup-before-final-delivery-$STAMP.tar.gz" \
  index.html shop.html product.html checkout.html css js 2>/dev/null || true

echo "Backup created: backups/backup-before-final-delivery-$STAMP.tar.gz"

cat > css/kawthar-final-delivery.css <<'CSS'
/* =========================================================
   KAWTHAR FINAL DELIVERY POLISH PACK
   Safe additive CSS only.
   Keeps logo, identity, colors, products, and content.
   ========================================================= */

:root {
  --kaw-espresso: #2d2119;
  --kaw-brown: #4b3829;
  --kaw-soft-brown: #6f5a47;
  --kaw-gold: #c9a05c;
  --kaw-gold-soft: rgba(201, 160, 92, 0.18);
  --kaw-ivory: #fffaf6;
  --kaw-cream: #f5ede4;
  --kaw-stroke: rgba(93, 67, 45, 0.12);
  --kaw-shadow: 0 18px 46px rgba(45, 33, 25, 0.08);
  --kaw-shadow-strong: 0 26px 70px rgba(45, 33, 25, 0.13);
}

/* Global safety */
html,
body {
  overflow-x: hidden !important;
}

body.kaw-final-ready {
  opacity: 1 !important;
  visibility: visible !important;
}

body.kaw-final-ready .site-shell,
body.kaw-final-ready main {
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}

/* Remove stuck splash only after JS marks page ready */
body.kaw-final-ready #splashScreen,
body.kaw-final-ready .splash-screen,
body.kaw-final-ready #goStartup,
body.kaw-final-ready .go-startup {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* Premium ambient base */
.site-shell {
  position: relative;
  isolation: isolate;
}

.noise-layer {
  opacity: 0.035 !important;
  pointer-events: none !important;
}

/* Header polish without changing structure */
.main-header {
  z-index: 80 !important;
  border-bottom: 1px solid rgba(93, 67, 45, 0.08) !important;
  box-shadow: 0 12px 34px rgba(45, 33, 25, 0.035) !important;
}

.brand-logo-img,
.brand-logo img {
  filter: drop-shadow(0 10px 18px rgba(45, 33, 25, 0.08));
}

.icon-circle,
.icon-btn {
  transition: transform 240ms ease, box-shadow 240ms ease, background 240ms ease !important;
}

.icon-circle:hover,
.icon-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 12px 24px rgba(45, 33, 25, 0.10) !important;
}

/* Announcement bar: slim and premium */
.announcement-bar {
  overflow: hidden !important;
  min-height: 32px !important;
}

.announcement-track {
  animation-duration: 42s !important;
  letter-spacing: 0.08em !important;
}

/* =========================================================
   HERO CINEMATIC POLISH
   ========================================================= */

.cin-hero {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
}

.cin-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 82% 22%, rgba(201,160,92,0.14), transparent 28%),
    radial-gradient(circle at 14% 26%, rgba(255,250,246,0.70), transparent 28%),
    linear-gradient(115deg, rgba(255,250,246,0.08), transparent 55%);
  z-index: 0;
  pointer-events: none;
}

.cin-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(93,67,45,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(93,67,45,0.035) 1px, transparent 1px);
  background-size: 84px 84px;
  mask-image: linear-gradient(180deg, transparent 0%, #000 16%, #000 78%, transparent 100%);
  z-index: 0;
  pointer-events: none;
}

.cin-hero__bg,
.cin-hero__stage,
.cin-hero__content {
  position: relative;
}

.cin-hero__content {
  z-index: 4 !important;
}

.cin-hero__stage {
  z-index: 2 !important;
}

.cin-hero__float {
  box-shadow: var(--kaw-shadow-strong) !important;
  transition: transform 700ms cubic-bezier(.2,.8,.2,1), box-shadow 700ms ease !important;
}

.cin-hero__float:hover {
  transform: translateY(-4px) scale(1.015) !important;
  box-shadow: 0 34px 90px rgba(45, 33, 25, 0.17) !important;
}

.cin-hero__float img {
  object-fit: cover !important;
  transition: transform 1200ms cubic-bezier(.2,.8,.2,1), filter 900ms ease !important;
}

.cin-hero__float:hover img {
  transform: scale(1.035) !important;
  filter: saturate(1.02) contrast(1.02) !important;
}

/* Hero benefits: convert ugly block into compact premium strip */
.cin-hero__metrics {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 12px !important;
  width: min(100%, 570px) !important;
  max-width: 570px !important;
  margin-top: 20px !important;
  padding: 0 !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}

.cin-metric__divider {
  display: none !important;
}

.cin-metric {
  position: relative !important;
  display: grid !important;
  gap: 6px !important;
  min-width: 0 !important;
  padding: 14px 14px 13px !important;
  border-radius: 20px !important;
  background:
    radial-gradient(circle at 18% 0%, rgba(201,160,92,0.14), transparent 42%),
    rgba(255, 250, 246, 0.82) !important;
  border: 1px solid rgba(93, 67, 45, 0.10) !important;
  box-shadow: 0 12px 28px rgba(45, 33, 25, 0.055) !important;
  text-align: left !important;
  overflow: hidden !important;
}

.cin-metric::before {
  content: "";
  width: 22px;
  height: 2px;
  border-radius: 999px;
  background: rgba(201, 160, 92, 0.74);
  display: block;
  margin-bottom: 1px;
}

.cin-metric::after {
  content: "";
  position: absolute;
  width: 70px;
  height: 70px;
  top: -45px;
  right: -35px;
  border-radius: 999px;
  border: 1px solid rgba(201,160,92,0.18);
  pointer-events: none;
}

.cin-metric__icon {
  display: none !important;
}

.cin-metric strong {
  margin: 0 !important;
  color: var(--kaw-espresso) !important;
  font-size: 0.92rem !important;
  line-height: 1.22 !important;
  font-weight: 850 !important;
}

.cin-metric span:not(.cin-metric__icon),
.cin-metric p,
.cin-metric small {
  margin: 0 !important;
  color: var(--kaw-soft-brown) !important;
  font-size: 0.76rem !important;
  line-height: 1.45 !important;
}

/* Buttons */
.cin-btn,
.btn {
  transition: transform 240ms ease, box-shadow 240ms ease, background 240ms ease, border-color 240ms ease !important;
}

.cin-btn:hover,
.btn:hover {
  transform: translateY(-2px) !important;
}

/* =========================================================
   CINEMATIC SECTION GRAPHICS
   ========================================================= */

.cin-material,
.cin-story,
.cin-cta,
.kaw-testimonials,
.cin-testimonials,
section[id*="testimonial"] {
  position: relative !important;
  isolation: isolate !important;
  overflow: hidden !important;
}

.cin-material::before,
.cin-story::before,
.cin-cta::before,
.kaw-testimonials::before,
.cin-testimonials::before,
section[id*="testimonial"]::before {
  content: "";
  position: absolute;
  width: min(42vw, 520px);
  height: min(42vw, 520px);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(201,160,92,0.12), transparent 66%);
  filter: blur(12px);
  opacity: 0.72;
  pointer-events: none;
  z-index: 0;
}

.cin-material::before {
  left: -10%;
  top: 8%;
}

.cin-story::before {
  right: -12%;
  top: 12%;
}

.cin-cta::before {
  left: 50%;
  top: 8%;
  transform: translateX(-50%);
  opacity: 0.45;
}

.cin-material > *,
.cin-story > *,
.cin-cta > *,
.kaw-testimonials > *,
.cin-testimonials > *,
section[id*="testimonial"] > * {
  position: relative;
  z-index: 2;
}

/* Luxury image interactions */
.cin-col-tile,
.product-card,
.cin-story__img-frame,
.cin-story__img-small,
.cin-craft__img-wrap,
.product-page-image-wrap {
  overflow: hidden !important;
  transition: transform 360ms ease, box-shadow 360ms ease, border-color 360ms ease !important;
}

.cin-col-tile:hover,
.product-card:hover,
.cin-story__img-frame:hover,
.cin-craft__img-wrap:hover {
  transform: translateY(-3px) !important;
  box-shadow: var(--kaw-shadow-strong) !important;
}

.cin-col-tile img,
.product-thumb img,
.cin-story__img-frame img,
.cin-story__img-small img,
.cin-craft__img-wrap img,
.product-page-image-wrap img {
  transition: transform 900ms cubic-bezier(.2,.8,.2,1), filter 700ms ease !important;
}

.cin-col-tile:hover img,
.product-card:hover .product-thumb img,
.cin-story__img-frame:hover img,
.cin-craft__img-wrap:hover img {
  transform: scale(1.035) !important;
  filter: saturate(1.02) contrast(1.02) !important;
}

/* Subtle gold line separator */
.cin-eyebrow,
.cin-section-label,
.kaw-testimonials__kicker,
[class*="eyebrow"],
[class*="kicker"] {
  letter-spacing: 0.16em !important;
}

/* =========================================================
   FEATURED / SHOP SAFETY STATES
   ========================================================= */

.kaw-shop-empty-note {
  grid-column: 1 / -1;
  padding: 24px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 10% 0%, rgba(201,160,92,0.14), transparent 38%),
    rgba(255,250,246,0.75);
  border: 1px solid rgba(93,67,45,0.12);
  color: var(--kaw-brown);
  text-align: center;
  box-shadow: var(--kaw-shadow);
}

.kaw-shop-empty-note strong {
  display: block;
  color: var(--kaw-espresso);
  font-size: 1rem;
  margin-bottom: 7px;
}

.kaw-shop-empty-note p {
  margin: 0;
  color: var(--kaw-soft-brown);
  font-size: 0.9rem;
  line-height: 1.65;
}

/* =========================================================
   FOOTER FINAL POLISH
   ========================================================= */

footer,
.main-footer,
.cin-footer,
.kaw-final-footer {
  background:
    radial-gradient(circle at 14% 0%, rgba(201,160,92,0.16), transparent 32%),
    linear-gradient(180deg, #f8f1ea 0%, #eadfd3 100%) !important;
  color: var(--kaw-brown) !important;
  border-top: 1px solid rgba(93,67,45,0.12) !important;
}

footer a,
.main-footer a,
.cin-footer a,
.kaw-final-footer a {
  color: var(--kaw-espresso) !important;
  font-weight: 700 !important;
  text-decoration: none !important;
}

footer a:hover,
.main-footer a:hover,
.cin-footer a:hover,
.kaw-final-footer a:hover {
  color: #9b6a2f !important;
}

footer p,
footer span,
footer li,
footer small,
.main-footer p,
.main-footer span,
.main-footer li,
.main-footer small,
.cin-footer p,
.cin-footer span,
.cin-footer li,
.cin-footer small {
  color: var(--kaw-brown) !important;
  opacity: 1 !important;
}

footer h1,
footer h2,
footer h3,
footer h4,
footer h5,
footer h6,
.main-footer h1,
.main-footer h2,
.main-footer h3,
.main-footer h4,
.main-footer h5,
.main-footer h6,
.cin-footer h1,
.cin-footer h2,
.cin-footer h3,
.cin-footer h4,
.cin-footer h5,
.cin-footer h6 {
  color: var(--kaw-espresso) !important;
  opacity: 1 !important;
}

/* =========================================================
   CHECKOUT FINAL POLISH
   ========================================================= */

.checkout-page {
  opacity: 1 !important;
  visibility: visible !important;
}

body.kaw-final-ready .checkout-page {
  display: block !important;
}

.instapay-main {
  gap: 16px !important;
}

.ipa-qr-card,
.ipa-qr-wrap,
.ipa-steps-guide {
  display: none !important;
}

.ipa-address-card,
.ipa-amount-card {
  border-radius: 22px !important;
  background:
    radial-gradient(circle at 12% 0%, rgba(201,160,92,0.13), transparent 42%),
    rgba(255,250,246,0.72) !important;
  border: 1px solid rgba(93,67,45,0.12) !important;
  box-shadow: 0 12px 28px rgba(45,33,25,0.055) !important;
}

.ipa-confirm-btn,
#confirmPayBtn {
  border-radius: 18px !important;
  background: linear-gradient(135deg, #2d2119, #4b3324) !important;
  color: #fffaf6 !important;
  font-weight: 900 !important;
  letter-spacing: 0.06em !important;
  box-shadow: 0 16px 32px rgba(45,33,25,0.15) !important;
}

.ipa-hero {
  border-radius: 26px !important;
}

/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

.kaw-reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 700ms ease, transform 700ms cubic-bezier(.2,.8,.2,1);
}

.kaw-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Mobile */
@media (max-width: 980px) {
  .cin-hero__metrics {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
    width: min(100%, 420px) !important;
    margin-inline: auto !important;
  }

  .cin-metric {
    padding: 12px 14px !important;
    border-radius: 18px !important;
  }
}

@media (max-width: 640px) {
  .cin-hero__metrics {
    display: none !important;
  }

  .cin-hero::after {
    background-size: 60px 60px;
    opacity: 0.55;
  }

  .product-card {
    border-radius: 20px !important;
  }

  .product-thumb {
    aspect-ratio: 1 / 1 !important;
    height: auto !important;
  }

  .cin-col-tile,
  .cin-col-tile--large {
    border-radius: 22px !important;
  }

  .checkout-grid {
    grid-template-columns: 1fr !important;
  }

  .ipa-qr-card,
  .ipa-qr-wrap {
    display: none !important;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }

  .kaw-reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
CSS

cat > js/kawthar-final-delivery.js <<'JS'
(function () {
  "use strict";

  const WA_NUMBER = "201034110499";
  const FINAL_TEXT = {
    paymentFooter: "Manual payment via InstaPay. Confirmation is completed on WhatsApp after the transfer screenshot.",
    orderLine1: "InstaPay confirmation",
    orderLine2: "WhatsApp support"
  };

  function markReady() {
    document.body.classList.add("kaw-final-ready");

    document.querySelectorAll("#splashScreen,.splash-screen,#goStartup,.go-startup").forEach((el) => {
      el.style.display = "none";
      el.style.opacity = "0";
      el.style.visibility = "hidden";
      el.style.pointerEvents = "none";
    });

    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
  }

  function removeDangerousRuntimeArtifacts() {
    document.querySelectorAll("#onlineGatewayBox").forEach((el) => el.remove());
  }

  function updateFooterPaymentCopy() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const text = node.nodeValue || "";

      if (text.includes("Online payment gateway is being prepared")) {
        node.nodeValue = FINAL_TEXT.paymentFooter;
      }

      if (text.trim() === "Card payment soon") {
        node.nodeValue = FINAL_TEXT.orderLine1;
      }

      if (text.trim() === "Mobile wallet soon") {
        node.nodeValue = FINAL_TEXT.orderLine2;
      }
    });
  }

  function polishHeroBenefits() {
    const metrics = document.querySelector(".cin-hero__metrics");
    if (!metrics) return;

    metrics.setAttribute("aria-label", "KAWTHAR benefits");
    metrics.querySelectorAll(".cin-metric").forEach((card, index) => {
      card.classList.add("kaw-reveal");
      card.style.transitionDelay = `${index * 80}ms`;
    });
  }

  function addRevealTargets() {
    const selectors = [
      ".cin-pillar",
      ".cin-col-tile",
      ".product-card",
      ".cin-story__copy",
      ".cin-story__media",
      ".cin-craft__copy",
      ".cin-craft__visual",
      ".kaw-testimonial-card",
      ".cin-cta .container",
      ".checkout-panel"
    ];

    document.querySelectorAll(selectors.join(",")).forEach((el, index) => {
      if (!el.classList.contains("kaw-reveal")) {
        el.classList.add("kaw-reveal");
        el.style.transitionDelay = `${Math.min(index % 6, 5) * 45}ms`;
      }
    });

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".kaw-reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll(".kaw-reveal").forEach((el) => io.observe(el));
  }

  function drawerSafety() {
    const overlay = document.getElementById("siteOverlay");
    const closeButtons = document.querySelectorAll("[data-close], .drawer-close, .modal-close");

    function closeAll() {
      document.body.classList.remove("drawer-open", "modal-open", "search-open", "cart-open", "wishlist-open", "nav-open");
      document.querySelectorAll(".drawer,.modal,.side-drawer,.quick-view-overlay").forEach((el) => {
        el.classList.remove("active", "open", "is-open");
        el.setAttribute("aria-hidden", "true");
      });
      if (overlay) {
        overlay.classList.remove("active", "open", "is-open");
        overlay.setAttribute("aria-hidden", "true");
      }
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAll();
    });

    if (overlay) {
      overlay.addEventListener("click", closeAll);
    }

    closeButtons.forEach((btn) => btn.addEventListener("click", closeAll));
  }

  function productGridSafety() {
    const isShop = /shop\.html/i.test(location.pathname);
    const isHome = /index\.html|\/$/i.test(location.pathname);

    if (!isShop && !isHome) return;

    function hasProducts() {
      return Boolean(
        document.querySelector(".product-card, [data-product-id], .product-item, .store-product-card")
      );
    }

    function removeNote() {
      document.querySelectorAll(".kaw-shop-empty-note").forEach((el) => el.remove());
    }

    function addNote() {
      if (hasProducts()) {
        removeNote();
        return;
      }

      if (document.querySelector(".kaw-shop-empty-note")) return;

      const target =
        document.querySelector("#featured .products-grid") ||
        document.querySelector(".products-grid") ||
        document.querySelector(".store-grid") ||
        document.querySelector(".shop-grid") ||
        document.querySelector("#featured") ||
        document.querySelector("main");

      if (!target) return;

      const note = document.createElement("div");
      note.className = "kaw-shop-empty-note";
      note.innerHTML = `
        <strong>Products are being loaded</strong>
        <p>If products do not appear, you can still ask directly on WhatsApp and KAWTHAR will help you pick the right piece.</p>
      `;

      if (target.classList.contains("products-grid") || target.classList.contains("store-grid") || target.classList.contains("shop-grid")) {
        target.appendChild(note);
      } else {
        target.appendChild(note);
      }
    }

    setTimeout(addNote, 2200);
    setTimeout(() => {
      if (hasProducts()) removeNote();
    }, 4500);
  }

  function fixWhatsappLinks() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');

    whatsappLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";

      if (href.includes("wa.me") && !href.includes("?text=")) {
        const msg = "Hi KAWTHAR, I would like to ask about your products.";
        link.setAttribute("href", `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`);
      }

      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer noopener");
    });
  }

  function fixTestimonialsSafety() {
    document.querySelectorAll("section, div").forEach((el) => {
      const text = (el.textContent || "").toLowerCase();
      if (text.includes("worn") && text.includes("adored") && text.includes("verified buyer")) {
        if (el.tagName.toLowerCase() === "section" || el.id.toLowerCase().includes("testimonial") || el.className.toString().toLowerCase().includes("testimonial")) {
          el.classList.add("kaw-testimonials");
        }
      }
    });
  }

  function run() {
    markReady();
    removeDangerousRuntimeArtifacts();
    updateFooterPaymentCopy();
    polishHeroBenefits();
    fixTestimonialsSafety();
    addRevealTargets();
    drawerSafety();
    productGridSafety();
    fixWhatsappLinks();

    console.info("KAWTHAR Final Delivery Polish Pack applied successfully.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(markReady, 700);
  setTimeout(run, 1200);
})();
JS

cat > js/kawthar-checkout-final.js <<'JS'
(function () {
  "use strict";

  if (!/checkout\.html/i.test(location.pathname)) return;

  const IPA = "kawthar@instapay";

  function safeText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function unlockCheckout() {
    document.body.classList.add("kaw-final-ready");

    document.querySelectorAll("#splashScreen,.splash-screen,#goStartup,.go-startup").forEach((el) => {
      el.remove();
    });

    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    const page = document.querySelector(".checkout-page");
    if (page) {
      page.style.display = "block";
      page.style.opacity = "1";
      page.style.visibility = "visible";
    }
  }

  function removeDuplicateInjectedPayments() {
    document.querySelectorAll("#onlineGatewayBox,#manualPaymentGateway,#kawSimpleCheckoutPay").forEach((el) => {
      el.remove();
    });
  }

  function simplifyExistingCheckout() {
    safeText("payPanelTitle", "Easy InstaPay payment");
    safeText("ipaHeroTitle", "Easy payment");
    safeText("ipaHeroSub", "Transfer via InstaPay, then confirm on WhatsApp");
    safeText("ipaAddrLabel", "InstaPay address");
    safeText("ipaAddress", IPA);
    safeText("qrLabel", "");
    safeText("qrNote", "");
    safeText("confirmBtnText", "Confirm on WhatsApp");
    safeText("confirmNote", "This opens WhatsApp with your order and payment confirmation request");

    document.querySelectorAll(".ipa-qr-card,.ipa-qr-wrap,#qrCanvas,#stepsGuide,.ipa-steps-guide").forEach((el) => {
      el.style.display = "none";
      el.setAttribute("aria-hidden", "true");
    });

    const copyBtn = document.getElementById("copyIpaBtn");
    if (copyBtn && !copyBtn.dataset.kawFinalCopy) {
      copyBtn.dataset.kawFinalCopy = "1";
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(IPA);
          copyBtn.setAttribute("aria-label", "InstaPay address copied");
        } catch {}
      });
    }
  }

  function addEmptyCartGuidance() {
    const list = document.getElementById("coCartList");
    if (!list) return;

    setTimeout(() => {
      const hasItem = Boolean(list.querySelector(".co-cart-item"));
      if (hasItem) return;
      if (document.getElementById("kawCheckoutEmptyHelp")) return;

      const help = document.createElement("div");
      help.id = "kawCheckoutEmptyHelp";
      help.className = "kaw-shop-empty-note";
      help.innerHTML = `
        <strong>Your selection is empty</strong>
        <p>Go back to the shop, choose your piece, then return here to confirm the order through InstaPay and WhatsApp.</p>
      `;

      list.appendChild(help);
    }, 1400);
  }

  function run() {
    unlockCheckout();
    removeDuplicateInjectedPayments();
    simplifyExistingCheckout();
    addEmptyCartGuidance();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  setTimeout(run, 400);
  setTimeout(run, 1200);
  setTimeout(unlockCheckout, 2200);

  console.info("KAWTHAR Checkout Finalizer applied.");
})();
JS

python3 - <<'PY'
from pathlib import Path
import re, time

ver = str(int(time.time()))

pages = ["index.html", "shop.html", "product.html", "checkout.html", "dashboard.html"]

def remove_known_bad(text):
    patterns = [
        r'\s*<script src="\./js/testimonials-overhaul\.js\?v=[^"]*"></script>',
        r'\s*<link rel="stylesheet" href="\./css/zz-testimonials-fix\.css\?v=[^"]*" />',
        r'\s*<script src="\./js/checkout-unlock-clean\.js\?v=[^"]*"></script>',
    ]
    for pat in patterns:
        text = re.sub(pat, "", text)
    return text

for name in pages:
    p = Path(name)
    if not p.exists():
        continue

    text = p.read_text(encoding="utf-8")
    text = remove_known_bad(text)

    # Remove previous final links to avoid duplicates
    text = re.sub(r'\s*<link rel="stylesheet" href="\./css/kawthar-final-delivery\.css\?v=[^"]*" />', "", text)
    text = re.sub(r'\s*<script src="\./js/kawthar-final-delivery\.js\?v=[^"]*"></script>', "", text)
    text = re.sub(r'\s*<script src="\./js/kawthar-checkout-final\.js\?v=[^"]*"></script>', "", text)

    # Add final CSS before </head>
    if "</head>" in text:
        text = text.replace(
            "</head>",
            f'  <link rel="stylesheet" href="./css/kawthar-final-delivery.css?v={ver}" />\n</head>',
            1
        )

    # Add final JS before </body>
    if "</body>" in text:
        text = text.replace(
            "</body>",
            f'  <script src="./js/kawthar-final-delivery.js?v={ver}"></script>\n</body>',
            1
        )

        if name == "checkout.html":
            text = text.replace(
                "</body>",
                f'  <script src="./js/kawthar-checkout-final.js?v={ver}"></script>\n</body>',
                1
            )

    p.write_text(text, encoding="utf-8")

print("Final delivery CSS/JS linked successfully.")
PY

if command -v node >/dev/null 2>&1; then
  echo "Checking JS syntax..."
  node --check js/kawthar-final-delivery.js
  node --check js/kawthar-checkout-final.js
fi

cat > FINAL_HANDOVER_CHECKLIST.md <<'MD'
# KAWTHAR Final Handover Checklist

## Home
- Hero text does not overlap images.
- Hero benefits look compact or hidden on mobile.
- Shop Collection and View Full Shop buttons work.
- Material, Collections, Featured, Story, Testimonials, CTA, Footer are visible.
- No stuck splash screen.

## Shop
- Products appear after loading.
- Filters do not break layout.
- Sort does not break layout.
- Gift guide modal does not overlap permanently.
- WhatsApp inquiry works.

## Product
- Product image is clear.
- Product title, category, price, and CTA are visible.
- Add to selection/cart works.
- WhatsApp inquiry works.

## Checkout
- Page opens without loader getting stuck.
- Cart items appear if selected.
- Empty cart has helpful message.
- InstaPay address is visible.
- QR block is hidden for simpler flow.
- Confirm on WhatsApp opens correct message.

## Mobile
- No horizontal scroll.
- Header, menu, search, wishlist, cart, and WhatsApp button do not block content.
- Images are not excessively tall.
- Footer is readable.

## Footer
- Shop, Order, Contact links work.
- Payment copy matches manual InstaPay/WhatsApp flow.
- No repeated or stacked ugly text.

## WhatsApp Flow
- Every WhatsApp button opens a message.
- Customer can ask about products.
- Checkout confirmation is clear.
MD

echo "=== DONE ==="
echo "Open the site with cache buster:"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/?v=$ver"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/shop.html?v=$ver"
echo "https://constantly-professionals-devoted-ground.trycloudflare.com/checkout.html?v=$ver"
echo ""
echo "Then hard refresh: Ctrl + F5"
