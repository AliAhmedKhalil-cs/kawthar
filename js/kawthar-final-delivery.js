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
