import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// بيانات الاتصال بقاعدة بياناتك (اللي أنت جبتها من Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAXqgvTkVgBGIkcedFMJswRgeBL6Vw54iM",
  authDomain: "project-4641926168641456672.firebaseapp.com",
  projectId: "project-4641926168641456672",
  storageBucket: "project-4641926168641456672.firebasestorage.app",
  messagingSenderId: "937208011566",
  appId: "1:937208011566:web:8b02c681f1c7b433d0f8bf",
  measurementId: "G-K5516T3FEV"
};

// تهيئة فايربيز
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ذاكرة مؤقتة عشان الموقع يفضل سريع جداً
let productsCache = [];

// السحر هنا: الموقع هيستنى لحد ما يحمل المنتجات من النت قبل ما يعرض أي حاجة
try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const tempProducts = [];
    querySnapshot.forEach((document) => {
        tempProducts.push({ id: Number(document.id), ...document.data() });
    });
    // ترتيب المنتجات (الأحدث أولاً)
    productsCache = tempProducts.sort((a, b) => b.id - a.id);
} catch (error) {
    console.error("Error loading from Firebase:", error);
}

// 1. جلب المنتجات (دي اللي كل الموقع بيستخدمها)
export const getProducts = () => {
    return productsCache;
};

// 2. إضافة أو تحديث منتج واحد في قاعدة البيانات
export const saveProductToDB = async (product) => {
    try {
        await setDoc(doc(db, "products", String(product.id)), product);
        
        // تحديث الذاكرة المؤقتة عشان التعديل يظهر فوراً قدامك
        const index = productsCache.findIndex(p => p.id === product.id);
        if (index !== -1) {
            productsCache[index] = product;
        } else {
            productsCache.unshift(product);
        }
    } catch(error) {
        console.error("Error saving product:", error);
        alert("خطأ في الحفظ في قاعدة البيانات!");
    }
};

// 3. حذف منتج من قاعدة البيانات
export const removeProductFromDB = async (id) => {
    try {
        await deleteDoc(doc(db, "products", String(id)));
        productsCache = productsCache.filter(p => p.id !== id);
    } catch(error) {
        console.error("Error removing product:", error);
        alert("خطأ في الحذف من قاعدة البيانات!");
    }
};

// 4. استرجاع النسخة الاحتياطية (Import Backup)
export const saveProducts = async (newProductsArray) => {
    productsCache = newProductsArray;
    for (const p of newProductsArray) {
        await setDoc(doc(db, "products", String(p.id)), p);
    }
};

// 5. تفريغ المتجر بالكامل (Reset)
export const resetProducts = async () => {
    for (const p of productsCache) {
        await deleteDoc(doc(db, "products", String(p.id)));
    }
    productsCache = [];
};