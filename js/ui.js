// js/ui.js
import { CONFIG } from "./config.js";
import { Store } from "./store.js";

const qs = (selector) => document.querySelector(selector);

const getLang = () => document.documentElement.lang || "en";

const dictionary = {
  en: {
    no_products: "No products found",
    try_another: "Try another category or search term.",
    no_matching: "No matching products",
    your_cart_empty: "Your cart is empty",
    your_wishlist_empty: "Your wishlist is empty",
    view_product: "View product",
    check_whatsapp: "Check on WhatsApp",
    add_to_cart: "Add to cart",
    add_to_selection: "Add to selection",
    save_to_wishlist: "Save to wishlist",
    saved_in_wishlist: "Saved in wishlist",
    remove: "Remove",
    qty: "Qty",
    each: "each",
    total: "Total",
    items: "Items",
    browse_piece: "View product",
    cart_message_intro: "Hi KAWTHAR, I want to check these items:",
    egp: "EGP"
  },
  ar: {
    no_products: "لا توجد منتجات",
    try_another: "حاولي استخدام تصنيف أو بحث مختلف.",
    no_matching: "لا توجد نتائج مطابقة",
    your_cart_empty: "سلة التسوق فارغة",
    your_wishlist_empty: "قائمة المفضلة فارغة",
    view_product: "عرض المنتج",
    check_whatsapp: "اطلبي عبر الواتساب",
    add_to_cart: "أضيفي للسلة",
    add_to_selection: "أضيفي للاختيار",
    save_to_wishlist: "احفظي في المفضلة",
    saved_in_wishlist: "محفوظ في المفضلة",
    remove: "حذف",
    qty: "الكمية",
    each: "للقطعة",
    total: "الإجمالي",
    items: "عدد القطع",
    browse_piece: "عرض المنتج",
    cart_message_intro: "مرحباً كوثر، أرغب في الاستفسار عن هذه المنتجات:",
    egp: "ج.م"
  }
};

const t = (key) => dictionary[getLang()]?.[key] || dictionary.en[key] || key;

const formatPrice = (price) => {
  const lang = getLang();
  return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0
  }).format(Number(price) || 0);
};

const getProductName = (product) =>
  getLang() === "ar" && product.nameAr ? product.nameAr : product.name;

const getProductMaterial = (product) =>
  getLang() === "ar" && product.materialAr ? product.materialAr : product.material;

const getProductBadge = (product) =>
  getLang() === "ar" && product.badgeAr ? product.badgeAr : product.badge;

export const UI = {
  activeDrawer: null,

  initHeaderEffect() {
    const header = qs("#mainHeader");
    if (!header) return;

    let isScrolled = false;
    const toggle = () => {
      const shouldBeScrolled = window.scrollY > 14;
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        if (isScrolled) header.classList.add("scrolled");
        else header.classList.remove("scrolled");
      }
    };

    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  },

  initRevealObserver() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
  },

  openDrawer(id) {
    const overlay = qs("#siteOverlay");
    const drawer = qs(`#${id}`);
    if (!drawer) return;

    this.closeAllDrawers();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    overlay?.classList.add("active");
    document.body.style.overflow = "hidden";
    this.activeDrawer = id;
  },

  closeDrawer(id) {
    const overlay = qs("#siteOverlay");
    const drawer = qs(`#${id}`);
    if (!drawer) return;

    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    overlay?.classList.remove("active");
    document.body.style.overflow = "";
    this.activeDrawer = null;
  },

  closeAllDrawers() {
    document.querySelectorAll(".drawer.open").forEach((drawer) => {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    });

    qs("#siteOverlay")?.classList.remove("active");
    document.body.style.overflow = "";
    this.activeDrawer = null;
  },

  renderProductGrid(products, mountSelector = "#productsGrid") {
    const grid = qs(mountSelector);
    if (!grid) return;

    if (!products.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>${t("no_products")}</h3>
          <p>${t("try_another")}</p>
        </div>
      `;
      return;
    }

    let html = "";
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const isWishlisted = Store.isWishlisted(product.id);
      const pName = getProductName(product);
      const pMat = getProductMaterial(product);
      const pBadge = getProductBadge(product);
      const pPrice = formatPrice(product.price);

      html += `
        <article class="product-card" data-qv-init="1" data-magnetic="1">
          <div class="product-thumb">
            <img src="${product.image}" alt="${product.alt}" loading="lazy" width="300" height="375" />
            ${pBadge ? `<span class="product-badge">${pBadge}</span>` : ""}

            <button
              class="product-fav ${isWishlisted ? "active" : ""}"
              type="button"
              data-action="wishlist-toggle"
              data-id="${product.id}"
              aria-label="${t("save_to_wishlist")}"
            >
              ♥
            </button>
          </div>

          <div class="product-content">
            <h3 class="product-title">${pName}</h3>
            <p class="product-meta">${pMat}</p>
            <p class="product-meta"><strong>${pPrice}</strong></p>

            <div class="product-actions">
              <a class="btn btn-secondary" href="./product.html?id=${product.id}" aria-label="${t("view_product")} - ${pName}">
                ${t("view_product")}
              </a>

              <button
                class="btn btn-primary"
                type="button"
                data-action="cart-add"
                data-id="${product.id}"
                aria-label="${t("add_to_cart")}"
              >
                ${t("add_to_cart")}
              </button>
            </div>
          </div>
        </article>
      `;
    }
    grid.innerHTML = html;
  },

  renderSearchResults(products) {
    const box = qs("#searchResults");
    if (!box) return;

    if (!products.length) {
      box.innerHTML = `
        <div class="empty-state">
          <h3>${t("no_matching")}</h3>
        </div>
      `;
      return;
    }

    let html = "";
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const pName = getProductName(product);
      const pMat = getProductMaterial(product);
      const pPrice = formatPrice(product.price);

      html += `
        <article class="search-result-card">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" width="82" height="92" />
          <div>
            <h3 class="line-title">${pName}</h3>
            <p class="line-meta">${pMat}</p>
            <p class="line-meta"><strong>${pPrice}</strong></p>
          </div>
          <div class="line-actions">
            <button
              class="line-icon-btn"
              type="button"
              data-action="cart-add"
              data-id="${product.id}"
              aria-label="${t("add_to_cart")}"
            >
              +
            </button>
            <a class="line-icon-btn" href="./product.html?id=${product.id}" aria-label="${t("browse_piece")}">↗</a>
          </div>
        </article>
      `;
    }
    box.innerHTML = html;
  },

  renderCart() {
    const box = qs("#cartItems");
    const count = qs("#cartCount");
    const itemsCount = qs("#cartItemsCount");
    const cart = Store.getCart();

    let totalItems = 0;
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
      totalItems += cart[i].quantity;
      totalPrice += (Number(cart[i].price) || 0) * cart[i].quantity;
    }

    if (count) count.textContent = String(totalItems);
    if (itemsCount) itemsCount.textContent = String(totalItems);

    if (!box) return;

    if (!cart.length) {
      box.innerHTML = `
        <div class="empty-state">
          <h3>${t("your_cart_empty")}</h3>
        </div>
      `;
      this.updateCheckoutLink([]);
      return;
    }

    let html = "";
    for (let i = 0; i < cart.length; i++) {
      const product = cart[i];
      const pName = getProductName(product);
      const pMat = getProductMaterial(product);
      const lineTotal = formatPrice((Number(product.price) || 0) * product.quantity);

      html += `
        <article class="cart-line">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" width="82" height="92" />
          <div>
            <h3 class="line-title">${pName}</h3>
            <p class="line-meta">${pMat}</p>
            <p class="line-meta"><strong>${formatPrice(product.price)}</strong> ${t("each")}</p>
            <p class="line-meta">${t("qty")}: ${product.quantity}</p>
            <p class="line-meta"><strong>${t("total")}:</strong> ${lineTotal}</p>
          </div>
          <div class="line-actions">
            <button class="line-icon-btn" type="button" data-action="cart-decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
            <button class="line-icon-btn" type="button" data-action="cart-increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
            <button class="line-icon-btn" type="button" data-action="cart-remove" data-id="${product.id}" aria-label="Remove item">×</button>
          </div>
        </article>
      `;
    }

    box.innerHTML = `
      ${html}
      <div class="cart-summary" style="margin-top:16px;">
        <div class="cart-summary-row">
          <span>${t("total")}</span>
          <strong>${formatPrice(totalPrice)}</strong>
        </div>
      </div>
    `;

    this.updateCheckoutLink(cart);
  },

  renderWishlist() {
    const box = qs("#wishlistItems");
    const count = qs("#wishlistCount");
    const items = Store.getWishlist();

    if (count) count.textContent = String(items.length);
    if (!box) return;

    if (!items.length) {
      box.innerHTML = `
        <div class="empty-state">
          <h3>${t("your_wishlist_empty")}</h3>
        </div>
      `;
      return;
    }

    let html = "";
    for (let i = 0; i < items.length; i++) {
      const product = items[i];
      const pName = getProductName(product);
      const pMat = getProductMaterial(product);

      html += `
        <article class="wishlist-line">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" width="82" height="92" />
          <div>
            <h3 class="line-title">${pName}</h3>
            <p class="line-meta">${pMat}</p>
            <p class="line-meta"><strong>${formatPrice(product.price)}</strong></p>
          </div>
          <div class="line-actions">
            <button class="line-icon-btn" type="button" data-action="wishlist-remove" data-id="${product.id}" aria-label="Remove from wishlist">×</button>
            <button class="line-icon-btn" type="button" data-action="cart-add" data-id="${product.id}" aria-label="Add to cart">+</button>
          </div>
        </article>
      `;
    }
    box.innerHTML = html;
  },

  updateCheckoutLink(cart) {
    const btn = qs("#checkoutWhatsAppBtn");
    if (!btn) return;

    if (!cart.length) {
      btn.href = `https://wa.me/${CONFIG.whatsappNumber}`;
      btn.textContent = getLang() === "ar" ? "تواصل عبر الواتساب" : "Chat on WhatsApp";
      btn.style.background = ""; 
      return;
    }

    btn.href = "./checkout.html";
    btn.textContent = getLang() === "ar" ? "ادفعي عبر فودافون كاش / InstaPay ←" : "Pay via Vodafone Cash / InstaPay ←";
    btn.style.background = "linear-gradient(135deg, #2d2119, #5e4a3d)";
  }
}
