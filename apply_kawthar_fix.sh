#!/usr/bin/env bash
set -euo pipefail

if [ ! -f index.html ] || [ ! -d css ] || [ ! -d js ]; then
  echo "ERROR: Run this from the website root folder that contains index.html, css/, js/."
  exit 1
fi

backup="backup-kawthar-before-fix-$(date +%F-%H%M%S).tar.gz"
tar -czf "$backup" index.html shop.html css js 2>/dev/null || true
echo "Backup created: $backup"

cat > css/fix-layout.css <<'CSS'
html{scroll-padding-top:118px}body{overflow-x:hidden}.announcement-bar{height:32px!important;min-height:32px!important;display:flex!important;align-items:center!important;overflow:hidden!important;letter-spacing:.08em!important;z-index:100!important}.announcement-track{width:100%!important;padding-inline-start:0!important;transform:none!important;animation:none!important;display:flex!important;justify-content:center!important;align-items:center!important;gap:14px!important;white-space:nowrap!important;font-size:.72rem!important;line-height:1!important}.main-header,.main-header:not(.scrolled),.main-header.scrolled{position:sticky!important;top:0!important;z-index:90!important;width:100%!important;min-height:82px!important;background:rgba(255,250,246,.88)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;border-bottom:1px solid var(--stroke)!important;box-shadow:0 10px 34px rgba(45,33,25,.06)!important}.header-inner{min-height:82px!important;display:grid!important;grid-template-columns:1fr auto 1fr!important;align-items:center!important;gap:22px!important;padding-block:10px!important}.header-left,.header-actions,.desktop-nav{display:flex!important;align-items:center!important}.header-left{justify-content:flex-start!important;min-width:0!important}.header-actions{justify-content:flex-end!important;gap:10px!important;min-width:0!important}.desktop-nav{gap:clamp(16px,2vw,28px)!important;flex-wrap:nowrap!important}.nav-link{position:relative!important;display:inline-flex!important;align-items:center!important;min-height:38px!important;color:var(--text-soft)!important;font-size:.82rem!important;font-weight:700!important;letter-spacing:.13em!important;text-transform:uppercase!important;white-space:nowrap!important;transition:color var(--ease),transform var(--ease)!important}.nav-link::after{content:""!important;position:absolute!important;inset-inline:0!important;bottom:2px!important;height:1px!important;background:currentColor!important;opacity:0!important;transform:scaleX(.4)!important;transition:opacity var(--ease),transform var(--ease)!important}.nav-link:hover,.nav-link.active{color:var(--brand-dark)!important;transform:translateY(-1px)!important}.nav-link:hover::after,.nav-link.active::after{opacity:.7!important;transform:scaleX(1)!important}.brand-logo{width:74px!important;height:74px!important;margin:0 auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}.brand-logo-img{width:68px!important;height:68px!important;object-fit:contain!important}.icon-circle{width:42px!important;height:42px!important;min-width:42px!important;border-radius:999px!important;font-size:.9rem!important;padding:0!important}.badge{top:-5px!important;inset-inline-end:-6px!important;right:auto!important;min-width:18px!important;height:18px!important;padding:0 5px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;font-size:.66rem!important;line-height:1!important;background:var(--brand-dark)!important;color:var(--surface-strong)!important;border-color:var(--brand-dark)!important}.cin-hero{min-height:calc(100svh - 114px)!important;padding-top:0!important;align-items:center!important}.cin-hero__content{max-width:52%!important;padding-block:clamp(64px,8vw,104px)!important}.cin-hero__kicker{width:auto!important;max-width:max-content!important;padding:10px 18px!important;margin-bottom:22px!important;border:1px solid var(--stroke)!important;border-radius:var(--radius-pill)!important;background:rgba(255,250,246,.52)!important;gap:10px!important}.cin-kicker-line{width:22px!important}.cin-hero__title{font-size:clamp(3.2rem,6vw,6.4rem)!important;margin-bottom:22px!important}.cin-hero__sub{margin-bottom:30px!important}.cin-hero__actions{margin-bottom:34px!important}.cin-hero__metrics{max-width:100%!important}.cin-hero__float{opacity:1!important}.cin-hero__float--1{width:clamp(220px,22vw,300px)!important;height:clamp(300px,29vw,400px)!important;top:12%!important}.cin-hero__float--2{width:clamp(160px,16vw,220px)!important;height:clamp(210px,21vw,290px)!important;bottom:10%!important}.cin-hero__float--3{width:clamp(120px,13vw,170px)!important;height:clamp(160px,17vw,220px)!important}.cin-hero__float--4{width:clamp(120px,12vw,150px)!important;height:clamp(150px,15vw,190px)!important}.store-toolbar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;margin:0 0 30px!important;padding:14px!important;border:1px solid var(--stroke)!important;border-radius:28px!important;background:rgba(255,250,246,.58)!important;backdrop-filter:blur(12px)!important;box-shadow:var(--shadow-sm)!important}.toolbar-left,.toolbar-right{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:10px!important}.toolbar-right{justify-content:flex-end!important}.products-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:clamp(16px,2vw,26px)!important;align-items:stretch!important}.empty-state{grid-column:1/-1!important;min-height:220px!important;display:grid!important;place-items:center!important;text-align:center!important;padding:36px!important;border:1px solid var(--stroke)!important;border-radius:28px!important;background:rgba(255,250,246,.58)!important}.product-card{min-width:0!important;height:100%!important;display:flex!important;flex-direction:column!important}.product-content{display:flex!important;flex:1!important;flex-direction:column!important}.product-actions{margin-top:auto!important}.shop-hero{padding:clamp(54px,7vw,92px) 0 28px!important}.shop-page-section{padding:22px 0 90px!important}.drawer{position:fixed!important;z-index:120!important}.site-overlay{z-index:110!important}.wa-float{z-index:95!important}@media(max-width:1120px){.products-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.desktop-nav{gap:14px!important}.nav-link{font-size:.76rem!important;letter-spacing:.1em!important}}@media(max-width:920px){html{scroll-padding-top:92px}.announcement-bar{height:28px!important;min-height:28px!important}.announcement-track{font-size:.66rem!important;gap:9px!important}.main-header,.main-header:not(.scrolled),.main-header.scrolled{min-height:72px!important}.header-inner{min-height:72px!important;grid-template-columns:auto 1fr auto!important;gap:10px!important}.desktop-nav{display:none!important}.mobile-only{display:inline-grid!important}.brand-logo{width:62px!important;height:62px!important;justify-self:center!important}.brand-logo-img{width:58px!important;height:58px!important}.header-actions{gap:7px!important}.icon-circle{width:38px!important;height:38px!important;min-width:38px!important}.cin-hero{min-height:auto!important}.cin-hero__content{max-width:100%!important;padding-block:58px 70px!important}.cin-hero__title{max-width:12ch!important}.cin-hero__float--1{opacity:.18!important;width:190px!important;height:250px!important;top:12%!important}.store-toolbar{align-items:stretch!important;flex-direction:column!important}.toolbar-left,.toolbar-right{justify-content:flex-start!important;width:100%!important}.products-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:640px){.container{width:min(calc(100% - 24px),var(--container))!important}.header-actions .icon-circle:nth-child(3),.header-actions .icon-circle:nth-child(4){display:none!important}.announcement-track span:nth-of-type(n+4){display:none!important}.cin-hero__content{padding-block:46px 58px!important;text-align:start!important}.cin-hero__kicker{font-size:.64rem!important;letter-spacing:.18em!important;padding:9px 14px!important}.cin-kicker-line{display:none!important}.cin-hero__title{font-size:clamp(2.55rem,12vw,4rem)!important;max-width:10ch!important}.cin-hero__actions{gap:10px!important}.cin-btn,.btn{min-height:44px!important}.cin-hero__metrics{display:none!important}.products-grid{grid-template-columns:1fr!important;gap:18px!important}.product-actions{grid-template-columns:1fr!important}.filter-pill,.chip{min-height:38px!important;padding-inline:13px!important;font-size:.82rem!important}.select-input,.price-filter-wrap{width:100%!important}}

CSS

cat > js/data.js <<'JS'
// js/data.js - fast local fallback + optional Firebase sync
const firebaseConfig = {
  apiKey: "AIzaSyAXqgvTkVgBGIkcedFMJswRgeBL6Vw54iM",
  authDomain: "project-4641926168641456672.firebaseapp.com",
  projectId: "project-4641926168641456672",
  storageBucket: "project-4641926168641456672.firebasestorage.app",
  messagingSenderId: "937208011566",
  appId: "1:937208011566:web:8b02c681f1c7b433d0f8bf",
  measurementId: "G-K5516T3FEV"
};

const mat = "Stainless Steel Anti Rust";
const matAr = "ستانلس ستيل مقاوم للصدأ";
const desc = "Premium anti-rust stainless steel piece with a refined feminine finish. Order directly through WhatsApp.";
const descAr = "قطعة فاخرة من الستانلس ستيل المقاوم للصدأ بلمسة أنثوية راقية، والطلب مباشرة عبر واتساب.";

const rows = [
  [1,"necklace","Dragonfly Gold Necklace","سلسلة الفراشة الذهبية",450,"1.webp","Featured","مميز"],
  [2,"necklace","Round Pendant Necklace","سلسلة بدلاية دائرية",420,"2.webp","Best Seller","الأكثر طلباً"],
  [3,"necklace","Bold Initial Necklace","سلسلة حروف فاخرة",520,"3.webp","New","جديد"],
  [4,"bracelet","Layered Gold Bracelet","أسورة ذهبية متعددة الطبقات",390,"4.webp","Premium","فاخر"],
  [5,"bracelet","Silver Link Bracelet","أسورة فضية لينك",360,"5.webp","Daily","يومي"],
  [6,"bracelet","Gold Chain Bracelet","أسورة جنزير ذهبية",380,"6.webp","Elegant","أنيق"],
  [7,"bracelet","Leaf Charm Bracelet","أسورة بتعليقة ورقة",340,"7.webp","Soft","ناعم"],
  [8,"ring","Minimal Hand Chain Ring","خاتم وسلسلة يد ناعمة",310,"8.webp","Gift","هدية"],
  [9,"necklace","Green Stone Necklace","سلسلة حجر أخضر",460,"9.webp","Limited","محدود"],
  [10,"necklace","Sun Coin Necklace","سلسلة عملة الشمس",470,"10.webp","Royal","ملكي"],
  [11,"necklace","Silver Coin Necklace","سلسلة عملة فضية",430,"11.webp","Classic","كلاسيك"],
  [12,"bracelet","Gold Link Bracelet","أسورة لينك ذهبية",370,"12.webp","Anti Rust","ضد الصدأ"],
  [13,"bracelet","Two Tone Link Bracelet","أسورة لينك لونين",390,"13.webp","Premium","فاخر"],
  [14,"bracelet","Chunky Gold Bracelet","أسورة ذهبية عريضة",410,"14.webp","Statement","بارز"],
  [15,"ring","Stacked Gold Rings","خواتم ذهبية متداخلة",330,"15.webp","Royal","ملكي"],
  [16,"handmade_bag","Black Handmade Beaded Bag","شنطة هاند ميد خرز سوداء",850,"16.webp","Handmade","هاند ميد"],
  [17,"bracelet","Elegant Hand Bracelet Set","طقم أساور يد أنيق",430,"17.webp","Set","طقم"],
  [18,"ring","Pearl Drop Hand Ring","خاتم يد بدلاية لؤلؤ",340,"18.webp","Soft","ناعم"],
  [19,"ring","Luxury Ring Display","تشكيلة خواتم فاخرة",290,"19.webp","Collection","تشكيلة"],
  [20,"ring","Star Hand Chain Ring","خاتم يد نجوم",350,"20.webp","Trendy","تريندي"],
  [21,"ring","Gold Drop Hand Chain","خاتم يد ذهبي بدلايات",360,"21.webp","Gift","هدية"],
  [22,"ring","Crystal Statement Ring","خاتم كريستال فاخر",390,"22.webp","Royal","ملكي"],
  [23,"necklace","Slim Layered Necklace Set","طقم سلاسل رفيعة",480,"23.webp","Layered","متعدد"],
  [24,"handmade_bag","Black Mini Handmade Bag","شنطة هاند ميد سوداء صغيرة",780,"24.webp","Handmade","هاند ميد"]
];

const fallbackProducts = rows.map(([id,category,name,nameAr,price,img,badge,badgeAr]) => ({
  id, category, name, nameAr, price,
  image: `./assets/products/${img}`,
  badge, badgeAr, material: mat, materialAr: matAr,
  description: desc, descriptionAr: descAr,
  alt: nameAr || name
}));

let productsCache = [...fallbackProducts];
let _loadPromise = null;
let fsMod = null;
let db = null;

const sortProducts = (items) => [...items].sort((a, b) => Number(b.id) - Number(a.id));
const notify = () => window.dispatchEvent(new CustomEvent("kawthar-products-updated"));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loadFirebase = async () => {
  if (fsMod && db) return fsMod;
  const [appModule, firestoreModule] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js")
  ]);
  const app = appModule.initializeApp(firebaseConfig);
  db = firestoreModule.getFirestore(app);
  fsMod = firestoreModule;
  return fsMod;
};

const normaliseProduct = (p = {}) => {
  const id = Number(p.id) || Date.now();
  const f = fallbackProducts.find((x) => x.id === id) || fallbackProducts[0];
  return {
    ...f, ...p, id,
    price: Number(p.price ?? f.price ?? 0),
    category: p.category || f.category || "necklace",
    name: p.name || f.name || `KAWTHAR Product ${id}`,
    nameAr: p.nameAr || f.nameAr || p.name || `منتج كوثر ${id}`,
    material: p.material || mat,
    materialAr: p.materialAr || matAr,
    image: p.image || f.image,
    alt: p.alt || p.nameAr || p.name || f.alt,
    description: p.description || f.description || desc,
    descriptionAr: p.descriptionAr || f.descriptionAr || descAr,
    badge: p.badge || f.badge || "Featured",
    badgeAr: p.badgeAr || f.badgeAr || "مميز"
  };
};

const loadProductsFromFirebase = async () => {
  const fs = await loadFirebase();
  const snapshot = await fs.getDocs(fs.collection(db, "products"));
  const remote = [];
  snapshot.forEach((docSnap) => remote.push(normaliseProduct({ id: Number(docSnap.id), ...docSnap.data() })));
  if (remote.length) {
    productsCache = sortProducts(remote);
    notify();
  }
};

const _loadProducts = async () => {
  productsCache = [...fallbackProducts];
  const remotePromise = loadProductsFromFirebase().catch((err) => console.warn("KAWTHAR: using local product fallback.", err));
  await Promise.race([remotePromise, delay(900)]);
};

_loadPromise = _loadProducts();

export const waitForProducts = () => _loadPromise;
export const getProducts = () => productsCache.length ? productsCache : [...fallbackProducts];

export const saveProductToDB = async (product) => {
  const finalProduct = normaliseProduct(product);
  try {
    const fs = await loadFirebase();
    await fs.setDoc(fs.doc(db, "products", String(finalProduct.id)), finalProduct);
  } catch (err) {
    console.error("Save error:", err);
    alert("تم حفظ المنتج محلياً مؤقتاً، لكن لم يتم حفظه في Firebase.");
  }
  const idx = productsCache.findIndex((p) => p.id === finalProduct.id);
  if (idx !== -1) productsCache[idx] = finalProduct;
  else productsCache.unshift(finalProduct);
  productsCache = sortProducts(productsCache);
  notify();
};

export const removeProductFromDB = async (id) => {
  try {
    const fs = await loadFirebase();
    await fs.deleteDoc(fs.doc(db, "products", String(id)));
  } catch (err) {
    console.error("Remove error:", err);
    alert("تم الحذف من العرض المحلي، لكن لم يتم تأكيد الحذف من Firebase.");
  }
  productsCache = productsCache.filter((p) => Number(p.id) !== Number(id));
  notify();
};

export const saveProducts = async (newArr) => {
  const finalProducts = sortProducts(newArr.map(normaliseProduct));
  productsCache = finalProducts;
  try {
    const fs = await loadFirebase();
    await Promise.all(finalProducts.map((p) => fs.setDoc(fs.doc(db, "products", String(p.id)), p)));
  } catch (err) { console.error("Bulk save error:", err); }
  notify();
};

export const resetProducts = async () => {
  try {
    const fs = await loadFirebase();
    await Promise.all(productsCache.map((p) => fs.deleteDoc(fs.doc(db, "products", String(p.id)))));
  } catch (err) { console.error("Reset error:", err); }
  productsCache = [...fallbackProducts];
  notify();
};

export const saveOrderToDB = async (orderData) => {
  try {
    const fs = await loadFirebase();
    const docRef = await fs.addDoc(fs.collection(db, "orders"), { ...orderData, createdAt: fs.serverTimestamp() });
    return docRef.id;
  } catch (err) {
    console.error("Order save error:", err);
    return null;
  }
};

export const getOrdersFromDB = async () => {
  try {
    const fs = await loadFirebase();
    const q = fs.query(fs.collection(db, "orders"), fs.orderBy("createdAt", "desc"));
    const snapshot = await fs.getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (err) {
    console.error("Load orders error:", err);
    return [];
  }
};

JS

python3 <<'PYCODE'
from pathlib import Path
import re

ann = '<div class="announcement-track">\n        <span data-i18n="announce_1">KAWTHAR • Stainless Steel Anti Rust</span>\n        <span>✦</span>\n        <span data-i18n="announce_2">Handmade Premium Bags</span>\n        <span>✦</span>\n        <span data-i18n="announce_3">Direct inquiry via WhatsApp</span>\n      </div>'

lang_script = '  <script id="kawthar-lang-head-fix">\n    document.documentElement.lang = localStorage.getItem(\'kawthar_lang\') || \'en\';\n    document.documentElement.dir = document.documentElement.lang === \'ar\' ? \'rtl\' : \'ltr\';\n  </script>\n'

nav_index = '<nav class="desktop-nav" role="navigation" aria-label="Main navigation">\n          <a href="./index.html#home" class="nav-link active" data-i18n="nav_home">Home</a>\n          <a href="./shop.html" class="nav-link" data-i18n="nav_shop">Shop</a>\n          <a href="./index.html#collections" class="nav-link" data-i18n="nav_collections">Collections</a>\n          <a href="./index.html#featured" class="nav-link" data-i18n="nav_featured">Featured</a>\n          <a href="./index.html#story" class="nav-link" data-i18n="nav_story">Story</a>\n        </nav>'

nav_shop = '<nav class="desktop-nav" role="navigation" aria-label="Main navigation">\n            <a href="./index.html#home" class="nav-link" data-i18n="nav_home">Home</a>\n            <a href="./shop.html" class="nav-link active" data-i18n="nav_shop">Shop</a>\n            <a href="./index.html#collections" class="nav-link" data-i18n="nav_collections">Collections</a>\n            <a href="./index.html#featured" class="nav-link" data-i18n="nav_featured">Featured</a>\n            <a href="./index.html#story" class="nav-link" data-i18n="nav_story">Story</a>\n          </nav>'

def patch_html(file_name, nav_html):
    p = Path(file_name)
    if not p.exists():
        return
    text = p.read_text(encoding="utf-8")
    text = re.sub(r'<div class="announcement-track">.*?</div>', ann, text, count=1, flags=re.S)
    text = re.sub(r'<nav class="desktop-nav"[^>]*>.*?</nav>', nav_html, text, count=1, flags=re.S)
    if 'fix-layout.css' not in text:
        text = text.replace('</head>', '  <link rel="stylesheet" href="./css/fix-layout.css?v=1.0" />\n</head>', 1)
    if 'kawthar-lang-head-fix' not in text:
        text = text.replace('<head>', '<head>\n' + lang_script, 1)
    p.write_text(text, encoding="utf-8")

patch_html('index.html', nav_index)
patch_html('shop.html', nav_shop)

app = Path('js/app.js')
if app.exists():
    text = app.read_text(encoding='utf-8')
    if 'kawthar-products-updated' not in text:
        needle = '  initGiftMode();'
        insert = '  initGiftMode();\n  window.addEventListener("kawthar-products-updated", () => {\n    try {\n      initPriceFilter();\n      rerender();\n      setTimeout(injectQuickViewButtons, 80);\n      setTimeout(initMagneticCards, 90);\n    } catch (err) {\n      console.warn("KAWTHAR: product refresh skipped", err);\n    }\n  });'
        text = text.replace(needle, insert, 1)
        app.write_text(text, encoding='utf-8')
PYCODE

echo "Done. Files updated: css/fix-layout.css, js/data.js, index.html, shop.html, js/app.js"
echo "Now test in browser with hard refresh: Ctrl+F5"

