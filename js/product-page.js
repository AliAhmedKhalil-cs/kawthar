import { CONFIG } from "./config.js";
import { getProducts, waitForProducts } from "./data.js";
import { Store } from "./store.js";
import { UI } from "./ui.js";
import {
  initWABubble,
  initSocialProof,
  renderShippingBar,
  initHeartBurst,
  initShareButton,
  initCountdownTimer,
  trackRecentlyViewed,
  initRecentlyViewedBar
} from "./features.js";

const getProductsList = () => getProducts();

const translations = {
  en: {
    lang_btn: "ع",
    product_not_found: "Product not found",
    product_missing: "The requested product does not exist or was removed.",
    back_to_shop: "Back to shop",
    selection: "KAWTHAR Selection",
    category: "Category",
    material: "Material",
    store_note: "Store Note",
    store_note_text: "Direct inquiry and order via WhatsApp",
    add_to_selection: "Add to selection",
    save_to_wishlist: "Save to wishlist",
    saved_in_wishlist: "Saved in wishlist",
    check_whatsapp: "Check on WhatsApp",
    related_eyebrow: "Related pieces",
    related_title: "You may also like these selections",
    no_related: "No related products yet",
    no_related_desc: "Add more products to expand the browsing flow.",
    search_title: "Search",
    search_heading: "Search products",
    search_placeholder: "Search pieces...",
    nav_home: "Home",
    nav_shop: "Shop",
    nav_story: "Story",
    nav_contact: "Contact",
    saved_title: "Saved",
    saved_heading: "Your wishlist",
    cart_title: "Cart",
    cart_heading: "Your selection",
    footer_desc: "Product pages are designed to increase trust, answer objections, and push direct inquiry.",
    footer_material: "Material: Stainless Steel Anti Rust",
    benefit_1: "✓ Stainless steel anti-rust material",
    benefit_2: "✓ Elegant styling for daily wear and gifting",
    benefit_3: "✓ Quick contact and confirmation on WhatsApp"
  },
  ar: {
    lang_btn: "EN",
    product_not_found: "المنتج غير موجود",
    product_missing: "المنتج المطلوب غير موجود أو تم حذفه.",
    back_to_shop: "العودة للمتجر",
    selection: "اختيار كوثر",
    category: "التصنيف",
    material: "الخامة",
    store_note: "ملاحظة المتجر",
    store_note_text: "الاستفسار والطلب مباشرة عبر الواتساب",
    add_to_selection: "أضيفي للاختيار",
    save_to_wishlist: "احفظي في المفضلة",
    saved_in_wishlist: "محفوظ في المفضلة",
    check_whatsapp: "اطلبي عبر الواتساب",
    related_eyebrow: "قطع مشابهة",
    related_title: "قد تعجبك هذه الاختيارات أيضاً",
    no_related: "لا توجد منتجات مشابهة حالياً",
    no_related_desc: "أضيفي منتجات أكثر لتوسيع تجربة التصفح.",
    search_title: "البحث",
    search_heading: "ابحثي عن المنتجات",
    search_placeholder: "ابحثي عن القطع...",
    nav_home: "الرئيسية",
    nav_shop: "المتجر",
    nav_story: "قصتنا",
    nav_contact: "تواصل معنا",
    saved_title: "المفضلة",
    saved_heading: "قائمة المفضلة",
    cart_title: "السلة",
    cart_heading: "اختياراتك",
    footer_desc: "صفحات المنتج مصممة لزيادة الثقة والإجابة عن الأسئلة ودفع العميل للتواصل المباشر.",
    footer_material: "الخامة: ستانلس ستيل مقاوم للصدأ",
    benefit_1: "✓ خامة ستانلس ستيل مقاومة للصدأ",
    benefit_2: "✓ تصميم أنيق مناسب للاستخدام اليومي والهدايا",
    benefit_3: "✓ تواصل سريع وتأكيد الطلب عبر الواتساب"
  }
};

const t = (key) => {
  const lang = document.documentElement.lang || "en";
  return translations[lang]?.[key] || translations.en[key] || key;
};

const formatPrice = (price) =>
  new Intl.NumberFormat(
    (document.documentElement.lang || "en") === "ar" ? "ar-EG" : "en-EG",
    {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0
    }
  ).format(Number(price) || 0);

const getProductIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
};

const getProductById = (id) => getProductsList().find((item) => item.id === id);

const getProductName = (product) =>
  (document.documentElement.lang || "en") === "ar" && product.nameAr
    ? product.nameAr
    : product.name;

const getProductMaterial = (product) =>
  (document.documentElement.lang || "en") === "ar" && product.materialAr
    ? product.materialAr
    : product.material;

const getProductDescription = (product) =>
  (document.documentElement.lang || "en") === "ar" && product.descriptionAr
    ? product.descriptionAr
    : product.description;

const getProductBadge = (product) =>
  (document.documentElement.lang || "en") === "ar" && product.badgeAr
    ? product.badgeAr
    : product.badge;

const applyStaticTranslations = () => {
  const lang = localStorage.getItem("kawthar_lang") || "en";
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  const langBtn = document.querySelector("#langToggleBtn");
  if (langBtn) langBtn.textContent = t("lang_btn");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang]?.[key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang]?.[key]) {
      el.setAttribute("placeholder", translations[lang][key]);
    }
  });
};

const renderMainProduct = (product) => {
  const mount = document.querySelector("#productPageMount");
  if (!mount) return;

  if (!product) {
    mount.innerHTML = `
      <div class="empty-state">
        <h3>${t("product_not_found")}</h3>
        <p>${t("product_missing")}</p>
        <a href="./shop.html" class="btn btn-primary" style="margin-top:16px;">${t("back_to_shop")}</a>
      </div>
    `;
    return;
  }

  const isWishlisted = Store.isWishlisted(product.id);

  mount.innerHTML = `
    <article class="product-page-layout reveal in-view">
      <div class="product-page-media">
        <div class="product-page-image-wrap">
          <img src="${product.image}" alt="${product.alt}" class="product-page-image" />
          <span class="product-page-badge">${getProductBadge(product)}</span>
        </div>
      </div>

      <div class="product-page-info">
        <p class="eyebrow">${t("selection")}</p>
        <h1 class="product-page-title">${getProductName(product)}</h1>

        <div class="product-info-stack">
          <div class="product-info-box">
            <strong>${t("category")}</strong>
            <span>${product.category}</span>
          </div>

          <div class="product-info-box">
            <strong>${t("material")}</strong>
            <span>${getProductMaterial(product)}</span>
          </div>

          <div class="product-info-box">
            <strong>${t("store_note")}</strong>
            <span>${t("store_note_text")}</span>
          </div>

          <div class="product-info-box">
            <strong>Price</strong>
            <span>${formatPrice(product.price)}</span>
          </div>
        </div>

        <p class="product-page-description">${getProductDescription(product)}</p>

        <div class="product-benefits">
          <div class="benefit-line">${t("benefit_1")}</div>
          <div class="benefit-line">${t("benefit_2")}</div>
          <div class="benefit-line">${t("benefit_3")}</div>
        </div>

        <div class="product-page-actions">
          <button
            class="btn btn-secondary"
            type="button"
            data-action="cart-add"
            data-id="${product.id}"
          >
            ${t("add_to_selection")}
          </button>

          <button
            class="btn btn-secondary ${isWishlisted ? "wishlist-active-btn" : ""}"
            type="button"
            data-action="wishlist-toggle"
            data-id="${product.id}"
          >
            ${isWishlisted ? t("saved_in_wishlist") : t("save_to_wishlist")}
          </button>

          <a
            class="btn btn-primary"
            href="https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
              `Hi KAWTHAR, I want to check "${product.name}" - ${product.price} EGP.`
            )}"
            target="_blank"
            rel="noreferrer"
          >
            ${t("check_whatsapp")}
          </a>
        </div>
      </div>
    </article>
  `;
};

const renderRelatedProducts = (currentProduct) => {
  const grid = document.querySelector("#relatedProductsGrid");
  if (!grid) return;

  const products = getProductsList();

  const related = products
    .filter((item) => item.id !== currentProduct.id)
    .filter((item) => item.category === currentProduct.category)
    .slice(0, 4);

  const fallback = products.filter((item) => item.id !== currentProduct.id).slice(0, 4);
  const finalList = related.length ? related : fallback;

  if (!finalList.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>${t("no_related")}</h3>
        <p>${t("no_related_desc")}</p>
      </div>
    `;
    return;
  }

  UI.renderProductGrid(finalList, "#relatedProductsGrid");
};

const initDrawerButtons = () => {
  document.querySelector("#mobileMenuBtn")?.addEventListener("click", () => UI.openDrawer("mobileMenu"));
  document.querySelector("#mobileMenuCloseBtn")?.addEventListener("click", () => UI.closeDrawer("mobileMenu"));

  document.querySelector("#searchOpenBtn")?.addEventListener("click", () => UI.openDrawer("searchDrawer"));
  document.querySelector("#searchCloseBtn")?.addEventListener("click", () => UI.closeDrawer("searchDrawer"));

  document.querySelector("#wishlistOpenBtn")?.addEventListener("click", () => UI.openDrawer("wishlistDrawer"));
  document.querySelector("#wishlistCloseBtn")?.addEventListener("click", () => UI.closeDrawer("wishlistDrawer"));

  document.querySelector("#cartOpenBtn")?.addEventListener("click", () => UI.openDrawer("cartDrawer"));
  document.querySelector("#cartCloseBtn")?.addEventListener("click", () => UI.closeDrawer("cartDrawer"));

  document.querySelector("#siteOverlay")?.addEventListener("click", () => UI.closeAllDrawers());
};

const initSearch = () => {
  const input = document.querySelector("#searchInput");
  if (!input) return;

  const render = (query = "") => {
    const products = getProductsList();
    const filtered = query
      ? products.filter((product) => {
          const q = query.toLowerCase().trim();
          return (
            product.name.toLowerCase().includes(q) ||
            (product.nameAr || "").toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            (product.descriptionAr || "").toLowerCase().includes(q)
          );
        })
      : products;

    // تم إصلاح البحث ليعرض 6 عناصر كحد أقصى لمنع التمرير اللانهائي
    UI.renderSearchResults(filtered.slice(0, 6));
  };

  render("");

  input.addEventListener("input", (event) => {
    render(event.target.value);
  });

  document.querySelectorAll("[data-search-tag]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.searchTag || "";
      input.value = tag;
      render(tag);
    });
  });
};

const rerenderSidePanels = () => {
  UI.renderCart();
  UI.renderWishlist();
  renderShippingBar();
};

const rerenderPage = () => {
  const currentId = getProductIdFromURL();
  const current = getProductById(currentId);
  renderMainProduct(current);
  if (current) {
    renderRelatedProducts(current);
    document.title = `${getProductName(current)} | KAWTHAR`;
  }
};

const initDelegatedActions = () => {
  document.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const id = Number(actionEl.dataset.id);
    const product = getProductById(id);

    if (action === "cart-add" && product) {
      Store.addToCart(product);
      rerenderSidePanels();
      UI.openDrawer("cartDrawer");
      return;
    }

    if (action === "cart-increase") {
      Store.increaseCartItem(id);
      rerenderSidePanels();
      return;
    }

    if (action === "cart-decrease") {
      Store.decreaseCartItem(id);
      rerenderSidePanels();
      return;
    }

    if (action === "cart-remove") {
      Store.removeFromCart(id);
      rerenderSidePanels();
      return;
    }

    if (action === "wishlist-toggle" && product) {
      Store.toggleWishlist(product);
      rerenderSidePanels();
      rerenderPage();
      return;
    }

    if (action === "wishlist-remove") {
      Store.removeFromWishlist(id);
      rerenderSidePanels();
      rerenderPage();
    }
  });
};

const initLanguage = () => {
  applyStaticTranslations();

  document.querySelector("#langToggleBtn")?.addEventListener("click", () => {
    const currentLang = document.documentElement.lang || "en";
    const newLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("kawthar_lang", newLang);
    applyStaticTranslations();
    rerenderSidePanels();
    rerenderPage();
    initSearch();
  });
};

const initStickyBar = () => {
  const bar = document.querySelector("#stickyWaBar");
  const nameEl = document.querySelector("#stickyWaName");
  const priceEl = document.querySelector("#stickyWaPrice");
  const waLink = document.querySelector("#stickyWaLink");
  const cartBtn = document.querySelector("#stickyCartBtn");

  if (!bar) return;

  const currentId = getProductIdFromURL();
  const product = getProductById(currentId);
  if (!product) return;

  // تحديث محتوى البار
  const updateBarContent = () => {
    const lang = document.documentElement.lang || "en";
    if (nameEl) nameEl.textContent = lang === "ar" && product.nameAr ? product.nameAr : product.name;
    if (priceEl) priceEl.textContent = formatPrice(product.price);
    if (waLink) {
      const msg = lang === "ar"
        ? `مرحباً كوثر! أريد الاستفسار عن "${product.nameAr || product.name}" - ${product.price} ج.م`
        : `Hi KAWTHAR! I want to check "${product.name}" - ${product.price} EGP`;
      waLink.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      waLink.textContent = t("check_whatsapp");
    }
    if (cartBtn) cartBtn.textContent = t("add_to_selection");
  };

  updateBarContent();

  // إظهار البار بعد تجاوز صورة المنتج
  const productInfo = document.querySelector(".product-page-info");
  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle("visible", !entry.isIntersecting);
      bar.setAttribute("aria-hidden", entry.isIntersecting ? "true" : "false");
    },
    { threshold: 0.1 }
  );

  if (productInfo) observer.observe(productInfo);

  cartBtn?.addEventListener("click", () => {
    if (product) {
      Store.addToCart(product);
      rerenderSidePanels();
      UI.openDrawer("cartDrawer");
    }
  });

  // إعادة تحديث محتوى البار عند تغيير اللغة
  const origApply = window.__kawtharLangObservers || [];
  origApply.push(updateBarContent);
  window.__kawtharLangObservers = origApply;
};

const init = () => {
  UI.initHeaderEffect();
  UI.initRevealObserver();
  initLanguage();
  initDrawerButtons();
  initSearch();
  initDelegatedActions();
  rerenderSidePanels();
  rerenderPage();
  initStickyBar();

  // Advanced Features
  initWABubble();
  initSocialProof();
  initHeartBurst();

  // Track + show recently viewed
  const currentId = getProductIdFromURL();
  if (currentId) trackRecentlyViewed(currentId);
  initRecentlyViewedBar(currentId);

  // Share button in product actions
  setTimeout(() => {
    const actionsEl = document.querySelector(".product-page-actions");
    if (actionsEl) initShareButton(actionsEl);

    // Countdown on product page info
    const infoBox = document.querySelector(".product-info-stack");
    if (infoBox) initCountdownTimer(infoBox, 47);
  }, 300);
};

document.addEventListener("DOMContentLoaded", async () => {
  await waitForProducts();
  init();
});

// إصلاح شاشة التحميل
window.addEventListener("load", () => {
  const splash = document.querySelector("#splashScreen");
  if (splash) {
    if (!sessionStorage.getItem("kawthar_splashed")) {
      setTimeout(() => {
        splash.classList.add("hidden");
        sessionStorage.setItem("kawthar_splashed", "true");
      }, 1500); 
    } else {
      splash.style.transition = "none";
      splash.classList.add("hidden");
    }
  }
});

/* =========================================================================
   PWA Setup & Custom Install Button
   ========================================================================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration failed:', err));
  });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // منع المتصفح من إظهار الرسالة الافتراضية
  e.preventDefault();
  deferredPrompt = e;

  // إنشاء زرار التثبيت داخل القائمة الجانبية لو مش موجود
  if (!document.getElementById('installPwaBtn')) {
    const navs = document.querySelectorAll('.drawer-nav');
    navs.forEach(nav => {
      const btn = document.createElement('button');
      btn.id = 'installPwaBtn';
      btn.className = 'drawer-nav-link';
      btn.style.cssText = 'color: var(--brand-deep); text-align: start; background: rgba(201, 160, 92, 0.15); border: 1px solid rgba(201, 160, 92, 0.3); border-radius: 16px; width: 100%; cursor: pointer; font-weight: 700; margin-top: 20px; padding: 14px 16px; display: flex; align-items: center; gap: 10px;';
      
      const lang = document.documentElement.lang || 'en';
      btn.innerHTML = lang === 'ar' ? '📱 تثبيت التطبيق كـ برنامج' : '📱 Install App on Device';

      btn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            document.querySelectorAll('#installPwaBtn').forEach(b => b.style.display = 'none');
          }
          deferredPrompt = null;
        }
      });
      nav.appendChild(btn);
    });
  }
});