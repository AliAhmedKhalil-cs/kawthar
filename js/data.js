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
const notify = () => window.dispatchEvent(new CustomEvent("kawtharabdo-products-updated"));
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

