// js/data.js - Fetching products directly from Google Sheets CSV
const googleSheetCSVUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLpLF4cWZN61EezC989XnPbeBIKYx-2PrMiYQX_zBsDALEkcbhtsb0kaC7lIO_CFst8dvCJc_v4o3w/pub?output=csv";

const fallbackProducts = [
  {
    id: 1,
    category: "necklace",
    name: "Dragonfly Gold Necklace",
    nameAr: "سلسلة الفراشة الذهبية",
    price: 450,
    image: "./assets/products/1.webp",
    badge: "Featured",
    badgeAr: "مميز",
    material: "Stainless Steel Anti Rust",
    materialAr: "ستانلس ستيل مقاوم للصدأ",
    description: "Premium anti-rust stainless steel piece with a refined feminine finish.",
    descriptionAr: "قطعة فاخرة من الستانلس ستيل المقاوم للصدأ بلمسة أنثوية راقية.",
    alt: "سلسلة الفراشة الذهبية"
  }
];

let productsCache = [];
let _loadPromise = null;

const sortProducts = (items) => [...items].sort((a, b) => Number(b.id) - Number(a.id));
const notify = () => window.dispatchEvent(new CustomEvent("kawtharabdo-products-updated"));

const fetchProductsFromSheet = async () => {
    try {
        const response = await fetch(googleSheetCSVUrl);
        if (!response.ok) throw new Error("Failed to fetch CSV");
        
        const csvText = await response.text();
        const rows = csvText.split('\n');
        const parsedProducts = [];

        // تخطي صف العناوين الأول
        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;
            
            // الحل: كود الفصل الصحيح الذي يعتمد على الفواصل فقط (,) ويتجاهل المسافات
            const row = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const cleanRow = row.map(cell => cell.replace(/^"|"$/g, '').trim());

            if (cleanRow.length >= 10) {
                parsedProducts.push({
                    id: Number(cleanRow[0]) || Date.now(),
                    nameAr: cleanRow[1],
                    name: cleanRow[2],
                    category: cleanRow[3] || 'necklace',
                    price: Number(cleanRow[4]) || 0,
                    badgeAr: cleanRow[5],
                    badge: "Featured",
                    descriptionAr: cleanRow[6],
                    description: cleanRow[7],
                    materialAr: cleanRow[8],
                    material: "Stainless Steel Anti Rust",
                    image: cleanRow[9],
                    slug: cleanRow[10] || "",
                    alt: cleanRow[1] || cleanRow[2]
                });
            }
        }

        if (parsedProducts.length > 0) {
            productsCache = sortProducts(parsedProducts);
            notify();
            return productsCache;
        }
        
    } catch (error) {
        console.error("KAWTHAR: Fetching from Google Sheets failed. Using fallback.", error);
    }
    
    productsCache = [...fallbackProducts];
    notify();
    return productsCache;
};

const _loadProducts = async () => {
    productsCache = [...fallbackProducts]; 
    await fetchProductsFromSheet();
};

_loadPromise = _loadProducts();

export const waitForProducts = () => _loadPromise;
export const getProducts = () => productsCache.length ? productsCache : [...fallbackProducts];

export const saveProductToDB = async () => console.warn("Saving directly is disabled when using Google Sheets.");
export const removeProductFromDB = async () => console.warn("Removing directly is disabled when using Google Sheets.");
export const saveProducts = async () => console.warn("Bulk save is disabled.");
export const resetProducts = async () => console.warn("Reset is disabled.");
export const saveOrderToDB = async () => { console.warn("Order saving requires a backend."); return null; };
export const getOrdersFromDB = async () => { return []; };
