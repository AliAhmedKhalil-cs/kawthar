import { getProducts, waitForProducts } from "./data.js";
import { Store } from "./store.js";
import { UI } from "./ui.js";
import {
  initWABubble,
  initSocialProof,
  renderShippingBar,
  initMagneticCards,
  initHeartBurst,
  showSkeletons,
  initQuickView,
  injectQuickViewButtons,
  initRecentlyViewedBar,
  initCountdownTimer
} from "./features.js";

const state = {
  currentFilter: "all",
  currentSort: "featured",
  searchQuery: "",
  maxPrice: Infinity
};

const translations = {
  en: {
    lang_btn: "ع",
    nav_home: "Home",
    nav_collections: "Collections",
    nav_featured: "Featured",
    nav_story: "Story",
    nav_shop: "Shop",
    nav_title: "Navigation",
    contact_title: "Contact",

    announce_1: "KAWTHAR • Stainless Steel Anti Rust",
    announce_2: "Handmade Premium Bags",
    announce_3: "Direct inquiry via WhatsApp",

    hero_kicker: "KAWTHAR COLLECTION",
    hero_title_main: "Define your elegance with ",
    hero_title_sub: "our feminine luxury touch",
    hero_desc: "Premium stainless steel accessories and handmade artisan bags designed for your unique style.",
    btn_shop: "Shop collection",
    btn_view: "View full shop",

    metric_1_title: "Luxury Feel",
    metric_1_desc: "Soft feminine premium identity",
    metric_2_title: "Anti Rust",
    metric_2_desc: "Made from stainless steel",
    metric_3_title: "Fast Inquiry",
    metric_3_desc: "Order directly on WhatsApp",

    trust_1_title: "Luxury presentation",
    trust_1_desc: "Elegant visuals and premium product storytelling for stronger conversion.",
    trust_2_title: "Stainless steel",
    trust_2_desc: "Selected pieces made from stainless steel anti-rust material.",
    trust_3_title: "Fast ordering flow",
    trust_3_desc: "From product card to WhatsApp in one clean experience.",
    
    trust_new_title: "Handmade Art",
    trust_new_desc: "Limited edition artisan bags crafted with premium care.",
    coll_bags_tag: "Handmade Bags",
    coll_bags_title: "Artisan Crafts",
    coll_rings_tag: "Signature Line",
    coll_rings_title: "Royal Selection",
    filter_rings: "Rings",
    filter_bags: "Bags",
    footer_all_products: "All products",
    footer_material_new: "Premium Stainless Steel & Artisan Bags",

    coll_eyebrow: "Collections",
    coll_title: "Curated for a polished feminine style",
    coll_1_tag: "Curated sets",
    coll_1_title: "Complete looks",
    coll_2_tag: "Signature line",
    coll_2_title: "Necklaces",
    coll_3_tag: "Daily luxury",
    coll_3_title: "Bracelets",
    btn_explore: "Explore",

    feat_eyebrow: "Featured",
    feat_title: "Most requested pieces from KAWTHAR",
    filter_all: "All",
    filter_necklaces: "Necklaces",
    filter_bracelets: "Bracelets",
    filter_anklets: "Anklets",
    filter_sets: "Sets",
    sort_featured: "Featured",
    sort_asc: "Name A-Z",
    sort_desc: "Name Z-A",
    sort_price_asc: "Price: Low to High",
    sort_price_desc: "Price: High to Low",
    price_filter_label: "Max price",
    price_filter_reset: "Reset price",
    gift_mode_btn: "🎁 Gift for someone?",
    gift_modal_title: "Order as a Gift",
    gift_modal_desc: "Tell us the occasion and we'll help you pick the perfect piece.",
    gift_opt_1_title: "Birthday Gift 🎂",
    gift_opt_1_desc: "Celebrate her special day",
    gift_opt_2_title: "Mother's Day 🌸",
    gift_opt_2_desc: "Show your love and appreciation",
    gift_opt_3_title: "Engagement Gift 💍",
    gift_opt_3_desc: "A premium piece for a special milestone",
    gift_opt_4_title: "Just Because 💝",
    gift_opt_4_desc: "Surprise someone you care about",
    gift_send_wa: "Send on WhatsApp",
    gift_cancel: "Cancel",

    story_eyebrow: "Our story",
    story_title: "Luxury, but with our own softer feminine signature",
    story_p1: "KAWTHAR is built around elegant pieces that feel refined, giftable, and visually premium from the first impression.",
    story_p2: "The store experience is designed to move the client naturally from attraction to interest to direct WhatsApp inquiry.",
    btn_ask_wa: "Ask on WhatsApp",
    btn_visit_ig: "Visit Instagram",

    cta_eyebrow: "Direct conversion",
    cta_title: "Ready to ask about a piece or place your order?",
    cta_desc: "Tap WhatsApp and send the product name directly. The store is designed to make that step natural and easy.",
    btn_start_wa: "Start WhatsApp inquiry",
    btn_follow_ig: "Follow Instagram",

    footer_desc: "A luxury-first storefront inspired by premium commerce experiences, rebuilt with KAWTHAR identity.",
    footer_material: "Material: Stainless Steel Anti Rust",

    shop_eyebrow: "Full collection",
    shop_title: "Shop the full KAWTHAR selection",
    shop_desc: "Explore premium stainless steel anti-rust pieces curated to feel elegant, giftable, and easy to order.",

    search_title: "Search",
    search_heading: "Find your next piece",
    search_placeholder: "Search..."
  },
  ar: {
    lang_btn: "EN",
    nav_home: "الرئيسية",
    nav_collections: "المجموعات",
    nav_featured: "المميز",
    nav_story: "قصتنا",
    nav_shop: "المتجر",
    nav_title: "روابط سريعة",
    contact_title: "تواصل معنا",

    announce_1: "كوثر • ستانلس ستيل مقاوم للصدأ",
    announce_2: "شنط يدوية (هاند ميد) فاخرة",
    announce_3: "تواصل مباشر عبر الواتساب",

    hero_kicker: "مجموعة كوثر",
    hero_title_main: "أبرزي أناقتك مع ",
    hero_title_sub: "لمستنا الأنثوية الفاخرة",
    hero_desc: "إكسسوارات فاخرة من الستانلس ستيل وشنط يدوية الصنع، مصممة لإطلالة يومية أنيقة وسهولة في الطلب.",
    btn_shop: "تسوقي المجموعة",
    btn_view: "عرض المتجر كاملاً",

    metric_1_title: "إحساس الفخامة",
    metric_1_desc: "هوية أنثوية ناعمة وراقية",
    metric_2_title: "مقاوم للصدأ",
    metric_2_desc: "مصنوع من الستانلس ستيل",
    metric_3_title: "استفسار سريع",
    metric_3_desc: "اطلبي مباشرة عبر الواتساب",

    trust_1_title: "تقديم فاخر",
    trust_1_desc: "تصميمات أنيقة وسرد راقي للمنتجات لضمان أفضل تجربة تسوق.",
    trust_2_title: "ستانلس ستيل",
    trust_2_desc: "قطع مختارة بعناية مصنوعة من الستانلس ستيل المقاوم للصدأ.",
    trust_3_title: "خطوات طلب سريعة",
    trust_3_desc: "من صفحة المنتج إلى الواتساب بتجربة سلسة ومباشرة.",
    
    trust_new_title: "فن يدوي فاخر",
    trust_new_desc: "شنط هاند ميد بإصدارات محدودة صنعت بحب وعناية فائقة.",
    coll_bags_tag: "شنط يدوية",
    coll_bags_title: "إبداع يدوي",
    coll_rings_tag: "مجموعة الخواتم",
    coll_rings_title: "خواتم ملكية",
    filter_rings: "خواتم",
    filter_bags: "شنط",
    footer_all_products: "كل المنتجات",
    footer_material_new: "ستانلس ستيل وشنط هاند ميد",

    coll_eyebrow: "المجموعات",
    coll_title: "منتقاة بعناية لأسلوب أنثوي راقي",
    coll_1_tag: "أطقم متكاملة",
    coll_1_title: "إطلالات كاملة",
    coll_2_tag: "تشكيلتنا المميزة",
    coll_2_title: "السلاسل",
    coll_3_tag: "فخامة يومية",
    coll_3_title: "الأساور",
    btn_explore: "اكتشفي",

    feat_eyebrow: "المميز",
    feat_title: "القطع الأكثر طلباً من كوثر",
    filter_all: "الكل",
    filter_necklaces: "سلاسل",
    filter_bracelets: "أساور",
    filter_anklets: "خلاخيل",
    filter_sets: "أطقم",
    sort_featured: "الأبرز",
    sort_asc: "الاسم (أ-ي)",
    sort_desc: "الاسم (ي-أ)",
    sort_price_asc: "السعر: من الأقل",
    sort_price_desc: "السعر: من الأعلى",
    price_filter_label: "الحد الأقصى للسعر",
    price_filter_reset: "إعادة ضبط السعر",
    gift_mode_btn: "🎁 هدية لشخص عزيز؟",
    gift_modal_title: "اطلبي كهدية",
    gift_modal_desc: "أخبرينا بالمناسبة وسنساعدك في اختيار القطعة المثالية.",
    gift_opt_1_title: "هدية عيد ميلاد 🎂",
    gift_opt_1_desc: "احتفلي بيومها المميز",
    gift_opt_2_title: "عيد الأم 🌸",
    gift_opt_2_desc: "أبدي حبك وتقديرك",
    gift_opt_3_title: "هدية خطوبة 💍",
    gift_opt_3_desc: "قطعة فاخرة لمحطة مميزة",
    gift_opt_4_title: "مجرد محبة 💝",
    gift_opt_4_desc: "فاجئي شخصاً عزيزاً عليك",
    gift_send_wa: "أرسلي عبر الواتساب",
    gift_cancel: "إلغاء",

    story_eyebrow: "قصتنا",
    story_title: "فخامة، بلمستنا الأنثوية الناعمة",
    story_p1: "تأسست كوثر على تقديم قطع أنيقة وراقية، مثالية كهدية، وتخطف الأنظار من النظرة الأولى.",
    story_p2: "تم تصميم المتجر لينقلك بسلاسة من الإعجاب بالقطعة إلى طلبها مباشرة عبر الواتساب.",
    btn_ask_wa: "اسألي عبر الواتساب",
    btn_visit_ig: "زوري إنستجرام",

    cta_eyebrow: "تواصل مباشر",
    cta_title: "مستعدة للاستفسار عن قطعة أو إتمام طلبك؟",
    cta_desc: "اضغطي على الواتساب وارسلي اسم المنتج مباشرة. المتجر مصمم لجعل هذه الخطوة سهلة وطبيعية.",
    btn_start_wa: "ابدئي المحادثة",
    btn_follow_ig: "تابعينا على إنستجرام",

    footer_desc: "واجهة فاخرة مستوحاة من تجارب التسوق الراقية، مصممة بهوية كوثر لتناسب أناقتك.",
    footer_material: "الخامة: ستانلس ستيل مقاوم للصدأ",

    shop_eyebrow: "كامل المجموعة",
    shop_title: "تسوقي كامل تشكيلة كوثر",
    shop_desc: "اكتشفي قطع ستانلس ستيل فاخرة مقاومة للصدأ، مختارة لتكون أنيقة وسهلة الطلب.",

    search_title: "البحث",
    search_heading: "ابحثي عن قطعتك القادمة",
    search_placeholder: "ابحثي هنا..."
  }
};

export const applyTranslations = () => {
  const lang = document.documentElement.lang || "en";

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

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (translations[lang]?.[key]) {
      el.setAttribute("aria-label", translations[lang][key]);
    }
  });
};

const setLanguage = (lang) => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  localStorage.setItem("kawthar_lang", lang);

  const btn = document.querySelector("#langToggleBtn");
  if (btn) btn.textContent = translations[lang].lang_btn;

  applyTranslations();
};

const initLanguage = () => {
  const savedLang = localStorage.getItem("kawthar_lang") || "en";
  setLanguage(savedLang);

  const toggleBtn = document.querySelector("#langToggleBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentLang = document.documentElement.lang;
      setLanguage(currentLang === "en" ? "ar" : "en");
      rerender();
    });
  }
};

const getProductsList = () => getProducts();

const getProductById = (id) =>
  getProductsList().find((item) => item.id === Number(id));

const matchesSearch = (product, query) => {
  const q = query.toLowerCase().trim();
  return (
    product.name.toLowerCase().includes(q) ||
    (product.nameAr || "").toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    (product.descriptionAr || "").toLowerCase().includes(q)
  );
};

const applyFilters = () => {
  let list = [...getProductsList()];

  if (state.currentFilter !== "all") {
    list = list.filter((product) => product.category === state.currentFilter);
  }

  if (state.searchQuery.trim()) {
    list = list.filter((product) => matchesSearch(product, state.searchQuery));
  }

  // فلتر السعر
  if (state.maxPrice !== Infinity) {
    list = list.filter((product) => Number(product.price) <= state.maxPrice);
  }

  const lang = document.documentElement.lang || "en";

  switch (state.currentSort) {
    case "name-asc":
      list.sort((a, b) => {
        const nameA = lang === "ar" && a.nameAr ? a.nameAr : a.name;
        const nameB = lang === "ar" && b.nameAr ? b.nameAr : b.name;
        return nameA.localeCompare(nameB, lang === "ar" ? "ar" : "en");
      });
      break;
    case "name-desc":
      list.sort((a, b) => {
        const nameA = lang === "ar" && a.nameAr ? a.nameAr : a.name;
        const nameB = lang === "ar" && b.nameAr ? b.nameAr : b.name;
        return nameB.localeCompare(nameA, lang === "ar" ? "ar" : "en");
      });
      break;
    case "price-asc":
      list.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price-desc":
      list.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    default:
      break;
  }

  return list;
};

const setActiveFilterPills = () => {
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.filter === state.currentFilter);
  });
};

const rerender = () => {
  const filtered = applyFilters();
  UI.renderProductGrid(filtered);
  UI.renderCart();
  UI.renderWishlist();
  renderShippingBar();

  if (state.searchQuery.trim()) {
    UI.renderSearchResults(filtered.slice(0, 8));
  } else {
    UI.renderSearchResults(getProductsList().slice(0, 6));
  }

  setActiveFilterPills();
  applyTranslations();

  // Re-inject Quick View buttons after grid re-render
  setTimeout(injectQuickViewButtons, 50);
  setTimeout(initMagneticCards, 60);
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

  input.addEventListener("input", (event) => {
    state.searchQuery = event.target.value;
    rerender();
  });

  document.querySelectorAll("[data-search-tag]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.searchTag || "";
      input.value = tag;
      state.searchQuery = tag;
      rerender();
    });
  });
};

const initFilters = () => {
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      state.currentFilter = pill.dataset.filter || "all";
      rerender();
    });
  });

  document.querySelectorAll("[data-filter-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currentFilter = btn.dataset.filterBtn || "all";
      rerender();
      const target = document.querySelector("#featured") || document.querySelector(".store-toolbar");
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // تم تفعيل رابط הפوتر (Handmade Bags)
  document.querySelectorAll("[data-filter-trigger]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      state.currentFilter = link.dataset.filterTrigger || "all";
      rerender();
      const target = document.querySelector("#featured") || document.querySelector(".store-toolbar");
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelector("#sortSelect")?.addEventListener("change", (event) => {
    state.currentSort = event.target.value;
    rerender();
  });
};

const initDelegatedActions = () => {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const id = Number(target.dataset.id);
    const product = getProductById(id);

    if (action === "cart-add" && product) {
      Store.addToCart(product);
      UI.renderCart();
      UI.openDrawer("cartDrawer");
      return;
    }

    if (action === "cart-increase") {
      Store.increaseCartItem(id);
      UI.renderCart();
      return;
    }

    if (action === "cart-decrease") {
      Store.decreaseCartItem(id);
      UI.renderCart();
      return;
    }

    if (action === "cart-remove") {
      Store.removeFromCart(id);
      UI.renderCart();
      return;
    }

    if (action === "wishlist-toggle" && product) {
      Store.toggleWishlist(product);
      UI.renderWishlist();
      UI.renderProductGrid(applyFilters());
      return;
    }

    if (action === "wishlist-remove") {
      Store.removeFromWishlist(id);
      UI.renderWishlist();
      UI.renderProductGrid(applyFilters());
    }
  });
};

const initPriceFilter = () => {
  const slider = document.querySelector("#priceRangeSlider");
  const label = document.querySelector("#priceRangeLabel");
  const resetBtn = document.querySelector("#priceFilterReset");
  if (!slider) return;

  const products = getProductsList();
  const maxProductPrice = Math.max(...products.map((p) => Number(p.price) || 0));
  const roundedMax = Math.ceil(maxProductPrice / 100) * 100;

  slider.max = roundedMax;
  slider.value = roundedMax;
  state.maxPrice = Infinity;

  const formatEGP = (val) =>
    new Intl.NumberFormat(document.documentElement.lang === "ar" ? "ar-EG" : "en-EG", {
      style: "currency", currency: "EGP", maximumFractionDigits: 0
    }).format(val);

  const updateSlider = (val) => {
    const pct = (val / roundedMax) * 100;
    slider.style.setProperty("--pct", `${pct}%`);
    if (label) label.textContent = formatEGP(val);
  };

  updateSlider(roundedMax);

  slider.addEventListener("input", () => {
    const val = Number(slider.value);
    updateSlider(val);
    state.maxPrice = val >= roundedMax ? Infinity : val;
    rerender();
  });

  resetBtn?.addEventListener("click", () => {
    slider.value = roundedMax;
    updateSlider(roundedMax);
    state.maxPrice = Infinity;
    rerender();
  });
};

const initGiftMode = () => {
  const btn = document.querySelector("#giftModeBtn");
  const overlay = document.querySelector("#giftModalOverlay");
  const closeBtn = document.querySelector("#giftModalClose");
  if (!btn || !overlay) return;

  const openModal = () => overlay.classList.add("open");
  const closeModal = () => overlay.classList.remove("open");

  btn.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  overlay.querySelector("#giftCancel")?.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Gift option selection
  overlay.querySelectorAll(".gift-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      overlay.querySelectorAll(".gift-option").forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });

  // WhatsApp gift message
  overlay.querySelector("#giftSendWhatsApp")?.addEventListener("click", () => {
    const selected = overlay.querySelector(".gift-option.selected");
    const lang = document.documentElement.lang || "en";
    const msgEN = selected
      ? `Hi KAWTHAR! I want to order a gift. Gift type: "${selected.querySelector("strong")?.textContent}". Please help me choose the best piece.`
      : `Hi KAWTHAR! I want to order a gift for someone special. Please help me choose the perfect piece.`;
    const msgAR = selected
      ? `مرحباً كوثر! أريد الطلب كهدية. نوع الهدية: "${selected.querySelector("strong")?.textContent}". أرجو مساعدتي في اختيار القطعة المناسبة.`
      : `مرحباً كوثر! أريد الطلب كهدية لشخص عزيز. أرجو مساعدتي في اختيار القطعة المثالية.`;
    const message = lang === "ar" ? msgAR : msgEN;
    window.open(`https://wa.me/201556694041?text=${encodeURIComponent(message)}`, "_blank");
    closeModal();
  });
};

const init = () => {
  UI.initHeaderEffect();
  UI.initRevealObserver();
  initDrawerButtons();
  initSearch();
  initFilters();
  initDelegatedActions();
  initLanguage();
  initPriceFilter();
  initGiftMode();
  rerender();

  // Advanced Features
  initWABubble();
  initSocialProof();
  initHeartBurst();
  initQuickView();
  initRecentlyViewedBar();

  // Countdown on featured section eyebrow (optional)
  const featEyebrow = document.querySelector(".featured-section .eyebrow");
  if (featEyebrow) initCountdownTimer(featEyebrow.parentElement, 47);
};

// دالة إخفاء شاشة التحميل (Splash Screen)
const hideSplash = () => {
  const splash = document.querySelector("#splashScreen");
  if (splash) {
    if (!sessionStorage.getItem("kawthar_splashed")) {
      setTimeout(() => {
        splash.style.transition = "opacity 0.5s ease";
        splash.style.opacity = "0";
        setTimeout(() => splash.classList.add("hidden"), 500);
        sessionStorage.setItem("kawthar_splashed", "true");
      }, 500); 
    } else {
      splash.style.transition = "none";
      splash.classList.add("hidden");
    }
  }
};

// تشغيل الموقع فوراً بمجرد وصول بيانات فايربيز (حتى لو الصفحة خلصت تحميل)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
    hideSplash();
  });
} else {
  // لو فايربيز أخرنا والصفحة حملت، شغل الكود واخفي اللوجو فوراً
  init();
  hideSplash();
}