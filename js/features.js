/**
 * features.js — KAWTHAR Advanced Features Module
 * Trust & Sales | Performance & Tech | UX & Interaction
 */

import { CONFIG } from "./config.js";
import { getProducts } from "./data.js";
import { Store } from "./store.js";
import { UI } from "./ui.js";

const getLang = () => document.documentElement.lang || "en";
const qs = (s) => document.querySelector(s);

const formatPrice = (price) =>
  new Intl.NumberFormat(getLang() === "ar" ? "ar-EG" : "en-EG", {
    style: "currency", currency: "EGP", maximumFractionDigits: 0
  }).format(Number(price) || 0);

const getProductName = (p) =>
  getLang() === "ar" && p.nameAr ? p.nameAr : p.name;

/* =========================================================================
   1. WhatsApp Floating Bubble
   ========================================================================= */
export const initWABubble = () => {
  if (qs("#waFloatBtn")) return;
  const lang = getLang();
  const tooltip = lang === "ar" ? "تواصلي معنا الآن" : "Chat with us now";
  const btn = document.createElement("button");
  btn.id = "waFloatBtn";
  btn.className = "wa-float";
  btn.setAttribute("aria-label", tooltip);
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.524 5.849L.057 23.428a.5.5 0 0 0 .515.572l5.718-1.502A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.7-.5-5.26-1.37l-.38-.22-3.94 1.03 1.05-3.83-.25-.4A10 10 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
    <span class="wa-float-tooltip">${tooltip}</span>
  `;
  btn.addEventListener("click", () => {
    const msg = lang === "ar"
      ? "مرحباً كوثر! أريد الاستفسار عن منتجاتكم."
      : "Hi KAWTHAR! I want to inquire about your products.";
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  });
  document.body.appendChild(btn);
};

/* =========================================================================
   2. Social Proof Toasts
   ========================================================================= */
export const initSocialProof = () => {
  if (qs("#spToastWrap")) return;
  const wrap = document.createElement("div");
  wrap.id = "spToastWrap";
  wrap.className = "sp-toast-wrap";
  document.body.appendChild(wrap);

  const lang = getLang();
  const messages = lang === "ar" ? [
    { sub: "منذ دقيقتين", action: "طلبت" },
    { sub: "منذ 5 دقائق", action: "أضافت للمفضلة" },
    { sub: "منذ 8 دقائق", action: "طلبت" },
    { sub: "منذ 12 دقيقة", action: "طلبت هدية" },
    { sub: "منذ 15 دقيقة", action: "طلبت" },
  ] : [
    { sub: "2 min ago", action: "just ordered" },
    { sub: "5 min ago", action: "saved to wishlist" },
    { sub: "8 min ago", action: "just ordered" },
    { sub: "12 min ago", action: "ordered as a gift" },
    { sub: "15 min ago", action: "just ordered" },
  ];

  const names = ["Sara M.", "Nour A.", "Layla K.", "Dina S.", "Rana H.",
                 "سارة م.", "نور أ.", "ليلى ك.", "دينا س.", "رنا ه."];

  const products = getProducts().slice(0, 6);
  if (!products.length) return;

  let msgIdx = 0;

  const showToast = () => {
    const product = products[Math.floor(Math.random() * products.length)];
    const msg = messages[msgIdx % messages.length];
    const name = names[Math.floor(Math.random() * (names.length / 2)) + (lang === "ar" ? 5 : 0)];
    msgIdx++;

    const toast = document.createElement("div");
    toast.className = "sp-toast";
    toast.innerHTML = `
      <img src="${product.image}" alt="${product.alt}" class="sp-toast-img" />
      <div class="sp-toast-text">
        <p class="sp-toast-name">${name} ${msg.action}</p>
        <p class="sp-toast-sub">${getProductName(product)} · ${msg.sub}</p>
      </div>
      <span class="sp-toast-dot"></span>
    `;

    wrap.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add("show"));
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  };

  // First toast after 8 seconds, then every 18-28 seconds
  setTimeout(showToast, 8000);
  const scheduleNext = () => {
    setTimeout(() => { showToast(); scheduleNext(); }, 18000 + Math.random() * 10000);
  };
  scheduleNext();
};

/* =========================================================================
   3. Cart Shipping Progress Bar
   ========================================================================= */
const FREE_SHIPPING_THRESHOLD = 800; // EGP

export const renderShippingBar = () => {
  const cartBox = qs("#cartItems");
  if (!cartBox) return;

  const lang = getLang();
  const cart = Store.getCart();
  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const pct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  const oldBar = qs("#cartShippingBar");
  if (oldBar) oldBar.remove();

  const bar = document.createElement("div");
  bar.id = "cartShippingBar";
  bar.className = "cart-shipping-bar";

  if (remaining > 0) {
    const remFormatted = formatPrice(remaining);
    const label = lang === "ar"
      ? `أضيفي <span>${remFormatted}</span> للحصول على شحن مجاني`
      : `Add <span>${remFormatted}</span> for free shipping`;
    bar.innerHTML = `
      <p class="shipping-bar-label">${label}</p>
      <div class="shipping-bar-track">
        <div class="shipping-bar-fill" style="width: ${pct}%"></div>
      </div>
    `;
  } else {
    const msg = lang === "ar" ? "🎉 تهانينا! حصلتِ على شحن مجاني" : "🎉 You've unlocked free shipping!";
    bar.innerHTML = `<p class="shipping-bar-done">${msg}</p>`;
  }

  const footer = qs(".drawer-footer");
  if (footer) footer.insertBefore(bar, footer.firstChild);
};

/* =========================================================================
   4. Countdown Timer
   ========================================================================= */
export const initCountdownTimer = (targetEl, durationMinutes = 47) => {
  if (!targetEl) return;
  let existing = targetEl.querySelector(".countdown-wrap");
  if (existing) return;

  const key = "kawthar_countdown_end";
  let endTime = Number(localStorage.getItem(key));
  if (!endTime || endTime < Date.now()) {
    endTime = Date.now() + durationMinutes * 60 * 1000;
    localStorage.setItem(key, endTime);
  }

  const lang = getLang();
  const labelText = lang === "ar" ? "ينتهي العرض خلال:" : "Offer ends in:";

  const wrap = document.createElement("div");
  wrap.className = "countdown-wrap";
  wrap.innerHTML = `<span class="countdown-icon">⏱</span><span>${labelText}</span><span class="countdown-digits" id="countdownDisplay">--:--:--</span>`;
  targetEl.appendChild(wrap);

  const display = wrap.querySelector("#countdownDisplay");

  const tick = () => {
    const diff = endTime - Date.now();
    if (diff <= 0) {
      display.textContent = lang === "ar" ? "انتهى العرض" : "Offer ended";
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, "0");
    display.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  tick();
  const interval = setInterval(tick, 1000);
  return () => clearInterval(interval);
};

/* =========================================================================
   5. Quick View Modal
   ========================================================================= */
let qvCleanup = null;

export const initQuickView = () => {
  if (qs("#quickViewOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "quickViewOverlay";
  overlay.className = "quick-view-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `<div class="quick-view-modal" id="quickViewModal"></div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeQuickView();
  });
};

export const openQuickView = (product) => {
  const overlay = qs("#quickViewOverlay");
  const modal = qs("#quickViewModal");
  if (!overlay || !modal || !product) return;

  const lang = getLang();
  const name = getProductName(product);
  const desc = lang === "ar" && product.descriptionAr ? product.descriptionAr : product.description;
  const mat  = lang === "ar" && product.materialAr ? product.materialAr : product.material;
  const badge = lang === "ar" && product.badgeAr ? product.badgeAr : product.badge;
  const isWL = Store.isWishlisted(product.id);

  const t = (en, ar) => lang === "ar" ? ar : en;

  modal.innerHTML = `
    <div class="qv-image-side">
      <button class="qv-close" id="qvCloseBtn" aria-label="Close">×</button>
      <img src="${product.image}" alt="${product.alt}" />
      <span class="product-page-badge">${badge}</span>
    </div>
    <div class="qv-info-side">
      <p class="eyebrow">${t("Quick View", "عرض سريع")}</p>
      <h2 class="qv-title">${name}</h2>
      <p class="qv-price">${formatPrice(product.price)}</p>
      <p class="qv-desc">${desc}</p>
      <p style="font-size:0.82rem;color:var(--text-faint);">${mat}</p>
      <div class="qv-actions">
        <button class="btn btn-secondary" type="button" data-qv-action="cart" data-id="${product.id}">
          ${t("Add to cart", "أضيفي للسلة")}
        </button>
        <button class="btn btn-secondary ${isWL ? "wishlist-active-btn" : ""}" type="button" data-qv-action="wishlist" data-id="${product.id}">
          ${isWL ? t("Saved ♥", "محفوظة ♥") : t("Save to wishlist", "احفظي في المفضلة")}
        </button>
        <a class="btn btn-primary" href="./product.html?id=${product.id}">
          ${t("View full details →", "تفاصيل كاملة →")}
        </a>
        <a class="btn btn-primary" href="https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hi KAWTHAR! I want to check "${product.name}" - ${product.price} EGP.`)}" target="_blank" rel="noreferrer">
          ${t("Order on WhatsApp", "اطلبي عبر الواتساب")}
        </a>
      </div>
    </div>
  `;

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  qs("#qvCloseBtn").addEventListener("click", closeQuickView);

  modal.querySelectorAll("[data-qv-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const products = getProducts();
      const p = products.find(x => x.id === id);
      if (!p) return;

      if (btn.dataset.qvAction === "cart") {
        Store.addToCart(p);
        UI.renderCart();
        closeQuickView();
        UI.openDrawer("cartDrawer");
      } else if (btn.dataset.qvAction === "wishlist") {
        Store.toggleWishlist(p);
        UI.renderWishlist();
        openQuickView(p); // re-render with updated state
      }
    });
  });
};

export const closeQuickView = () => {
  const overlay = qs("#quickViewOverlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

/* =========================================================================
   6. Magnetic Hover Effect on Product Cards
   ========================================================================= */
export const initMagneticCards = () => {
  const applyMagnetic = (card) => {
    if (card.dataset.magnetic) return;
    card.dataset.magnetic = "1";

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const strength = 8;
      card.style.transform = `translate(${dx * strength}px, ${dy * strength - 6}px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, border-color 0.28s ease";
      setTimeout(() => { card.style.transition = ""; }, 500);
    });
  };

  // Apply to existing cards
  document.querySelectorAll(".product-card").forEach(applyMagnetic);

  // Watch for dynamically added cards
  const observer = new MutationObserver(() => {
    document.querySelectorAll(".product-card:not([data-magnetic])").forEach(applyMagnetic);
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

/* =========================================================================
   7. Heart Burst Wishlist Animation
   ========================================================================= */
export const initHeartBurst = () => {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".product-fav");
    if (!btn) return;

    btn.classList.remove("burst");
    void btn.offsetWidth;
    btn.classList.add("burst");

    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ["#b7998b", "#c9a05c", "#2d2119", "#8c7362"];

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement("span");
      particle.className = "heart-particle";
      const angle = (i / 6) * Math.PI * 2;
      const dist = 20 + Math.random() * 18;
      particle.style.cssText = `
        left: ${cx - 4}px; top: ${cy - 4}px;
        background: ${colors[i % colors.length]};
        --dx: ${Math.cos(angle) * dist}px;
        --dy: ${Math.sin(angle) * dist - 10}px;
        position: fixed; z-index: 999;
      `;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }

    btn.addEventListener("animationend", () => btn.classList.remove("burst"), { once: true });
  });
};

/* =========================================================================
   8. Share Button
   ========================================================================= */
export const initShareButton = (targetEl) => {
  if (!targetEl || qs("#shareProductBtn")) return;
  const lang = getLang();
  const label = lang === "ar" ? "مشاركة" : "Share";
  const copiedLabel = lang === "ar" ? "تم النسخ ✓" : "Copied ✓";

  const btn = document.createElement("button");
  btn.id = "shareProductBtn";
  btn.className = "share-btn";
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> ${label}`;

  btn.addEventListener("click", async () => {
    const url = window.location.href;
    const title = document.title;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        btn.textContent = copiedLabel;
        btn.classList.add("copied");
        setTimeout(() => {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> ${label}`;
          btn.classList.remove("copied");
        }, 2500);
      }
    } catch {}
  });

  targetEl.appendChild(btn);
};

/* =========================================================================
   9. Skeleton Loading
   ========================================================================= */
export const showSkeletons = (gridSelector = "#productsGrid", count = 8) => {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  grid.innerHTML = Array.from({ length: count }).map(() => `
    <div class="product-card-skeleton">
      <div class="skeleton skeleton-thumb"></div>
      <div class="skeleton-content">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-meta"></div>
        <div class="skeleton skeleton-price"></div>
        <div class="skeleton skeleton-actions"></div>
      </div>
    </div>
  `).join("");
};

/* =========================================================================
   10. Blur-up Lazy Image Loading
   ========================================================================= */
export const initBlurUpImages = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const wrap = entry.target;
      const img = wrap.querySelector("img.lazy-img");
      if (!img) return;
      const src = img.dataset.src;
      if (!src) return;
      img.src = src;
      img.onload = () => {
        img.classList.add("loaded");
        wrap.classList.add("img-loaded");
      };
      observer.unobserve(wrap);
    });
  }, { rootMargin: "200px" });

  document.querySelectorAll(".blur-img-wrap").forEach((w) => observer.observe(w));
};

/* =========================================================================
   11. Recently Viewed Products Bar
   ========================================================================= */
const RV_KEY = "kawthar_recently_viewed";
const MAX_RV = 6;

export const trackRecentlyViewed = (productId) => {
  try {
    let rv = JSON.parse(localStorage.getItem(RV_KEY)) || [];
    rv = [productId, ...rv.filter((id) => id !== productId)].slice(0, MAX_RV);
    localStorage.setItem(RV_KEY, JSON.stringify(rv));
  } catch {}
};

export const initRecentlyViewedBar = (currentProductId = null) => {
  try {
    const rv = (JSON.parse(localStorage.getItem(RV_KEY)) || [])
      .filter((id) => id !== currentProductId);
    if (rv.length < 2) return;

    const products = getProducts();
    const items = rv
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 5);

    if (!items.length) return;

    const lang = getLang();
    const label = lang === "ar" ? "شاهدتِ مؤخراً" : "Recently viewed";

    const bar = document.createElement("div");
    bar.id = "recentlyViewedBar";
    bar.className = "recently-viewed-bar";
    bar.innerHTML = `
      <div class="rv-inner container">
        <span class="rv-label">${label}</span>
        ${items.map((p) => `
          <a href="./product.html?id=${p.id}" class="rv-item">
            <img src="${p.image}" alt="${p.alt}" loading="lazy" />
            <div>
              <p class="rv-item-name">${getProductName(p)}</p>
              <p class="rv-item-price">${formatPrice(p.price)}</p>
            </div>
          </a>
        `).join("")}
      </div>
    `;

    document.body.appendChild(bar);

    // Show bar after 4 seconds
    setTimeout(() => bar.classList.add("visible"), 4000);

    // Hide when sticky WA bar is visible to avoid overlap
    const stickyBar = document.querySelector("#stickyWaBar");
    if (stickyBar) {
      const obs = new MutationObserver(() => {
        if (stickyBar.classList.contains("visible")) {
          bar.classList.remove("visible");
        } else {
          setTimeout(() => bar.classList.add("visible"), 500);
        }
      });
      obs.observe(stickyBar, { attributes: true, attributeFilter: ["class"] });
    }
  } catch {}
};

/* =========================================================================
   12. Quick View Trigger — inject button into product cards
   ========================================================================= */
export const injectQuickViewButtons = () => {
  const lang = getLang();
  const label = lang === "ar" ? "عرض سريع" : "Quick view";

  document.querySelectorAll(".product-card:not([data-qv-init])").forEach((card) => {
    card.dataset.qvInit = "1";
    const thumb = card.querySelector(".product-thumb");
    if (!thumb) return;

    const btn = document.createElement("button");
    btn.className = "product-qv-btn";
    btn.textContent = label;
    btn.type = "button";
    thumb.appendChild(btn);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cartBtn = card.querySelector("[data-action='cart-add']");
      const id = Number(cartBtn?.dataset?.id || card.querySelector("[data-id]")?.dataset?.id);
      const product = getProducts().find((p) => p.id === id);
      if (product) openQuickView(product);
    });
  });
};
