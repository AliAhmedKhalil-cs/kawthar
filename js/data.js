import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, addDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXqgvTkVgBGIkcedFMJswRgeBL6Vw54iM",
  authDomain: "project-4641926168641456672.firebaseapp.com",
  projectId: "project-4641926168641456672",
  storageBucket: "project-4641926168641456672.firebasestorage.app",
  messagingSenderId: "937208011566",
  appId: "1:937208011566:web:8b02c681f1c7b433d0f8bf",
  measurementId: "G-K5516T3FEV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let productsCache = [];
let _loadPromise = null;

// دالة تحميل واحدة بس — بتُستدعى من كل مكان
const _loadProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const temp = [];
    querySnapshot.forEach((d) => temp.push({ id: Number(d.id), ...d.data() }));
    productsCache = temp.sort((a, b) => b.id - a.id);
  } catch (err) {
    console.error("Firebase load error:", err);
    productsCache = [];
  }
};

// تحميل فوري عند import الملف
_loadPromise = _loadProducts();

// انتظر لحد ما البيانات توصل (للـ init functions)
export const waitForProducts = () => _loadPromise;

// جلب المنتجات من الكاش (synchronous)
export const getProducts = () => productsCache;

// إضافة أو تحديث منتج
export const saveProductToDB = async (product) => {
  try {
    await setDoc(doc(db, "products", String(product.id)), product);
    const idx = productsCache.findIndex(p => p.id === product.id);
    if (idx !== -1) productsCache[idx] = product;
    else productsCache.unshift(product);
  } catch (err) {
    console.error("Save error:", err);
    alert("خطأ في الحفظ في قاعدة البيانات!");
  }
};

// حذف منتج
export const removeProductFromDB = async (id) => {
  try {
    await deleteDoc(doc(db, "products", String(id)));
    productsCache = productsCache.filter(p => p.id !== id);
  } catch (err) {
    console.error("Remove error:", err);
    alert("خطأ في الحذف من قاعدة البيانات!");
  }
};

// استرجاع نسخة احتياطية
export const saveProducts = async (newArr) => {
  productsCache = newArr;
  for (const p of newArr) {
    await setDoc(doc(db, "products", String(p.id)), p);
  }
};

// تفريغ المتجر
export const resetProducts = async () => {
  for (const p of productsCache) {
    await deleteDoc(doc(db, "products", String(p.id)));
  }
  productsCache = [];
};

// ==========================================
// قسم إدارة الطلبات (Orders Management)
// ==========================================

// حفظ الطلب الجديد في قاعدة البيانات
export const saveOrderToDB = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.error("Order save error:", err);
    return null;
  }
};

// جلب كل الطلبات لعرضها في لوحة التحكم
export const getOrdersFromDB = async () => {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Load orders error:", err);
    return [];
  }
};