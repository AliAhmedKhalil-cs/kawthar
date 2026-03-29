import { getProducts, saveProducts, resetProducts } from "./data.js";
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.16.1";

env.allowLocalModels = false;

const slugify = (text) => String(text).trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
const formatPrice = (price) => new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(Number(price) || 0);

const renderProductsList = (products) => {
  const mount = document.querySelector("#dashboardProductsList");
  if (!mount) return;
  if (!products.length) {
    mount.innerHTML = `<div class="empty-state"><h3>No products yet</h3><p>Use the form to start adding products.</p></div>`;
    return;
  }
  mount.innerHTML = products.map(product => `
    <article class="dashboard-product-row">
      <div class="dashboard-product-media"><img src="${product.image}" alt="${product.alt}" /></div>
      <div class="dashboard-product-content">
        <div class="dashboard-row-head">
          <h3>${product.name}</h3><span class="dashboard-badge">${product.badge || "Featured"}</span>
        </div>
        <div class="dashboard-meta">
          <span>${product.category}</span><span>${formatPrice(product.price)}</span>
        </div>
        <div class="dashboard-mini-actions">
          <button class="btn btn-secondary" type="button" data-dashboard-remove="${product.id}">Remove</button>
        </div>
      </div>
    </article>
  `).join("");
};

const smartTemplates = {
  necklace: { name: "Elegant Signature Necklace", nameAr: "سلسلة الأناقة المميزة", desc: "A premium stainless steel anti-rust necklace designed for elegant daily styling. Features a refined polished finish.", descAr: "سلسلة فاخرة من الستانلس ستيل المقاوم للصدأ، مصممة لإطلالة يومية أنيقة بلمسة لامعة تخطف الأنظار.", price: 450 },
  bracelet: { name: "Luxury Chain Bracelet", nameAr: "أسورة السلسلة الفاخرة", desc: "A coordinated premium bracelet ideal for gifting and easy luxury styling. Made to resist rust and fading.", descAr: "أسورة فاخرة متناسقة، مثالية كهدية ويسهل تنسيقها. مصنوعة بجودة عالية لتقاوم الصدأ وتدوم طويلاً.", price: 380 },
  ring: { name: "Royal Statement Ring", nameAr: "الخاتم الملكي البارز", desc: "An eye-catching ring with a bold feminine aesthetic. Crafted from durable stainless steel anti-rust.", descAr: "خاتم يخطف الأنظار بتصميم أنثوي جريء. مصنوع من الستانلس ستيل المتين المقاوم للصدأ ليرافقك كل يوم.", price: 320 },
  earring: { name: "Classic Luminous Earring", nameAr: "حلق اللمعان الكلاسيكي", desc: "Lightweight and elegant earrings that add a soft luxury feel to your face.", descAr: "حلق خفيف الوزن وأنيق، يضفي لمسة من الفخامة النعومة على إطلالتك.", price: 290 },
  anklet: { name: "Delicate Summer Anklet", nameAr: "خلخال الصيف الرقيق", desc: "A subtle and beautiful anklet piece, perfect for a polished feminine style.", descAr: "خلخال رقيق وجميل، يكمل أناقتك الأنثوية بلمسة صيفية ساحرة.", price: 250 },
  handmade_bag: { name: "Artisan Hand-Stitched Bag", nameAr: "حقيبة يدوية الصنع (هاند ميد)", desc: "A unique, limited edition handmade bag crafted with love and premium materials. Each piece is a unique work of art.", descAr: "حقيبة يدوية فريدة من نوعها، مصنوعة بحب وبأجود المواد. كل قطعة تعتبر لوحة فنية خاصة بصاحبتها.", price: 1250 },
  set: { name: "Complete Luxury Set", nameAr: "طقم الفخامة المتكامل", desc: "A curated collection of matching pieces for a complete and highly polished look.", descAr: "مجموعة متناسقة من القطع الفاخرة لإطلالة متكاملة وغاية في الأناقة.", price: 850 }
};

const fillDataFields = (category) => {
  const template = smartTemplates[category] || smartTemplates.necklace;
  document.querySelector("#productCategory").value = category;
  document.querySelector("#productName").value = template.name;
  document.querySelector("#productNameAr").value = template.nameAr;
  document.querySelector("#productDescription").value = template.desc;
  document.querySelector("#productDescriptionAr").value = template.descAr;
  document.querySelector("#productPrice").value = template.price;
  document.querySelector("#productSlug").value = slugify(template.name);
  document.querySelector("#productAlt").value = `Kawthar ${template.name}`;
};

let classifier = null;

const initProAI = async () => {
  const btn = document.querySelector("#aiDetectBtn");
  const status = document.querySelector("#aiStatus");
  const categorySelect = document.querySelector("#productCategory");
  if (!btn) return;

  try {
    classifier = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
    btn.innerHTML = "✨ AI Magic Fill";
    btn.disabled = false;
    status.textContent = "🧠 Pro AI is Ready! Enter image path and click.";
  } catch (error) {
    btn.textContent = "⚠️ Error";
    status.textContent = "Failed to load AI Model.";
  }

  btn.addEventListener("click", async () => {
    const imgPath = document.querySelector("#productImage").value.trim();
    if (!imgPath) { alert("Please enter the image path first!"); return; }

    btn.innerHTML = "🔍 Analyzing...";
    status.textContent = "🧠 AI is looking at the image...";

    try {
      const labels = ["necklace jewelry", "bracelet jewelry", "ring jewelry", "earring jewelry", "anklet jewelry", "handmade bag", "jewelry set"];
      const output = await classifier(imgPath, labels);
      const topLabel = output[0].label;
      let detectedCategory = "necklace";
      
      if (topLabel.includes("ring")) detectedCategory = "ring";
      else if (topLabel.includes("earring")) detectedCategory = "earring";
      else if (topLabel.includes("bracelet")) detectedCategory = "bracelet";
      else if (topLabel.includes("anklet")) detectedCategory = "anklet";
      else if (topLabel.includes("bag")) detectedCategory = "handmade_bag";
      else if (topLabel.includes("set")) detectedCategory = "set";

      fillDataFields(detectedCategory);
      status.textContent = `🎯 Success! It's a [${detectedCategory.toUpperCase()}].`;
      btn.innerHTML = "✨ AI Magic Fill";
    } catch (err) {
      btn.innerHTML = "✨ AI Magic Fill";
      status.textContent = "❌ Analysis Failed! Check image path.";
    }
  });

  categorySelect.addEventListener("change", (e) => {
    fillDataFields(e.target.value);
    status.textContent = `⚡ Manual Fill: ${e.target.value.toUpperCase()}`;
  });
};

const initBackupSystem = () => {
  const exportBtn = document.querySelector("#exportProductsBtn");
  const importBtn = document.querySelector("#importProductsBtn");
  const fileInput = document.querySelector("#importFileHidden");

  if (!exportBtn || !importBtn || !fileInput) return;

  exportBtn.addEventListener("click", () => {
    const products = getProducts();
    if (!products.length) { alert("No products to export!"); return; }
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `kawthar_backup_${new Date().toISOString().slice(0, 10)}.json`;
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
    alert("📥 Backup exported successfully!");
  });

  importBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          if (confirm(`Import ${imported.length} products? This will merge with existing ones.`)) {
            const current = getProducts();
            const merged = [...imported, ...current.filter(c => !imported.find(i => i.id === c.id))];
            saveProducts(merged);
            renderProductsList(getProducts());
            alert("🚀 Backup restored!");
          }
        }
      } catch (err) { alert("❌ Invalid backup file."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  });
};

const initForm = () => {
  const form = document.querySelector("#dashboardForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const products = getProducts();
    const newProduct = {
      id: Date.now(),
      name: document.querySelector("#productName").value.trim(),
      nameAr: document.querySelector("#productNameAr").value.trim(),
      slug: document.querySelector("#productSlug").value.trim() || slugify(document.querySelector("#productName").value.trim()),
      category: document.querySelector("#productCategory").value.trim(),
      badge: document.querySelector("#productBadge").value.trim() || "New Arrival",
      badgeAr: document.querySelector("#productBadgeAr").value.trim() || "وصل حديثاً",
      material: document.querySelector("#productMaterial").value.trim() || "Stainless Steel Anti Rust",
      materialAr: document.querySelector("#productMaterialAr").value.trim() || "ستانلس ستيل مقاوم للصدأ",
      price: Number(document.querySelector("#productPrice").value),
      image: document.querySelector("#productImage").value.trim(),
      alt: document.querySelector("#productAlt").value.trim(),
      description: document.querySelector("#productDescription").value.trim(),
      descriptionAr: document.querySelector("#productDescriptionAr").value.trim()
    };
    products.unshift(newProduct);
    saveProducts(products);
    renderProductsList(getProducts());
    form.reset();
    document.querySelector("#aiStatus").textContent = "✅ Product Added!";
  });
};

const initRemoveActions = () => {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-dashboard-remove]");
    if (!btn) return;
    const id = Number(btn.dataset.dashboardRemove);
    saveProducts(getProducts().filter((item) => item.id !== id));
    renderProductsList(getProducts());
  });
};

const initReset = () => {
  document.querySelector("#resetProductsBtn")?.addEventListener("click", () => {
    if (confirm("Are you sure? This will delete all local products!")) {
      resetProducts();
      renderProductsList(getProducts());
    }
  });
};

const init = () => {
  renderProductsList(getProducts());
  initForm();
  initRemoveActions();
  initReset();
  initProAI();
  initBackupSystem();
};

document.addEventListener("DOMContentLoaded", init);

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