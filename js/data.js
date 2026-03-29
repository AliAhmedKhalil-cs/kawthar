import { CONFIG } from "./config.js";

const defaultProducts = [
  {
    id: 1,
    name: "Golden Wing Pendant",
    nameAr: "قلادة الجناح الذهبي",
    slug: "golden-wing-pendant",
    category: "necklace",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    badge: "Best Seller",
    badgeAr: "الأكثر مبيعاً",
    price: 450,
    image: "./assets/products/1.jpg",
    alt: "Golden wing pendant necklace",
    description: "A standout statement necklace with a refined polished finish for modern luxury styling.",
    descriptionAr: "قلادة بارزة بتصميم عصري ولمسة لامعة فاخرة تبرز أناقتك."
  },
  {
    id: 2,
    name: "Horus Eye Necklace",
    nameAr: "قلادة عين حورس",
    slug: "horus-eye-necklace",
    category: "necklace",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    badge: "Popular",
    badgeAr: "شائع",
    price: 380,
    image: "./assets/products/2.jpg",
    alt: "Horus eye necklace",
    description: "An Egyptian-inspired necklace designed to feel elegant, symbolic, and easy to pair.",
    descriptionAr: "قلادة مستوحاة من التراث المصري، بتصميم رمزي أنيق يسهل تنسيقه."
  },
  {
    id: 3,
    name: "Pharaoh Portrait Pendant",
    nameAr: "قلادة وجه الفرعون",
    slug: "pharaoh-portrait-pendant",
    category: "necklace",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    badge: "New",
    badgeAr: "جديد",
    price: 520,
    image: "./assets/products/3.jpg",
    alt: "Pharaoh pendant necklace",
    description: "A premium pendant piece with a richer visual story and polished metallic character.",
    descriptionAr: "قلادة فاخرة تروي قصة بصرية غنية بطابع معدني مصقول."
  },
  {
    id: 4,
    name: "Luxury Bracelet Set",
    nameAr: "طقم أساور فاخر",
    slug: "luxury-bracelet-set",
    category: "set",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    badge: "Set",
    badgeAr: "طقم",
    price: 850,
    image: "./assets/products/4.jpg",
    alt: "Luxury bracelet set",
    description: "A curated collection of matching bracelets for a complete and highly polished look.",
    descriptionAr: "مجموعة متناسقة من الأساور لإطلالة متكاملة وغاية في الأناقة."
  },
  {
    id: 5,
    name: "Elegant Dual Bracelet",
    nameAr: "أسورة مزدوجة أنيقة",
    slug: "elegant-dual-bracelet",
    category: "bracelet",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    badge: "Trending",
    badgeAr: "رائج",
    price: 410,
    image: "./assets/products/5.jpg",
    alt: "Elegant dual bracelet",
    description: "A beautiful layered bracelet that adds volume and feminine charm to any outfit.",
    descriptionAr: "أسورة جميلة بطبقات تضفي سحراً أنثوياً مميزاً على أي إطلالة."
  },
  {
    id: 6,
    name: "Leaf Bracelet",
    nameAr: "أسورة ورقة الشجر",
    slug: "leaf-bracelet",
    category: "bracelet",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    badge: "Signature",
    badgeAr: "مميز",
    price: 360,
    image: "./assets/products/6.jpg",
    alt: "Leaf bracelet",
    description: "A lightweight bracelet silhouette with premium shine and soft luxury feel.",
    descriptionAr: "أسورة خفيفة الوزن بلمعان فاخر وإحساس بالنعومة والرقي."
  },
  {
    id: 7,
    name: "Royal Stone Piece",
    nameAr: "قطعة الحجر الملكي",
    slug: "royal-stone-piece",
    category: "necklace",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    badge: "Limited",
    badgeAr: "إصدار محدود",
    price: 600,
    image: "./assets/products/7.jpg",
    alt: "Royal stone piece",
    description: "A more artistic premium design for standout styling and gift-worthy presentation.",
    descriptionAr: "تصميم فني فاخر لإطلالة بارزة، مثالية كهدية قيمة."
  },
  {
    id: 8,
    name: "Luxury Chain Bracelet",
    nameAr: "أسورة السلسلة الفاخرة",
    slug: "luxury-chain-bracelet",
    category: "bracelet",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    badge: "Giftable",
    badgeAr: "هدية مثالية",
    price: 390,
    image: "./assets/products/8.jpg",
    alt: "Luxury chain bracelet",
    description: "A coordinated premium piece ideal for gifting, layering, and easy luxury styling.",
    descriptionAr: "قطعة فاخرة متناسقة، مثالية كهدية ويسهل تنسيقها مع قطع أخرى."
  }
];

export const getProducts = () => {
  try {
    const local = JSON.parse(localStorage.getItem(CONFIG.storageKeys.localProducts));
    if (Array.isArray(local) && local.length) return local;
  } catch (error) {
    console.error("Failed to read local products:", error);
  }
  return defaultProducts;
};

export const saveProducts = (products) => {
  localStorage.setItem(CONFIG.storageKeys.localProducts, JSON.stringify(products));
};

export const resetProducts = () => {
  localStorage.removeItem(CONFIG.storageKeys.localProducts);
};