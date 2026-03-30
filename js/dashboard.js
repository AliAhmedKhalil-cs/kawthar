import { getProducts, saveProductToDB, removeProductFromDB, saveProducts, resetProducts } from "./data.js";
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.16.1";

env.allowLocalModels = false;

let editingProductId = null;

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
        <div class="dashboard-mini-actions" style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="btn btn-secondary" type="button" data-dashboard-edit="${product.id}">Edit</button>
          <button class="btn btn-secondary" type="button" data-dashboard-remove="${product.id}" style="background: #dc3545; color: white; border: none;">Remove</button>
        </div>
      </div>
    </article>
  `).join("");
};

const smartTemplates = {
  necklace: { name: "Elegant Signature Necklace", nameAr: "سلسلة الأناقة المميزة", desc: "A premium stainless steel anti-rust necklace designed for elegant daily styling.", descAr: "سلسلة فاخرة من الستانلس ستيل المقاوم للصدأ.", price: 450 },
  bracelet: { name: "Luxury Chain Bracelet", nameAr: "أسورة السلسلة الفاخرة", desc: "A coordinated premium bracelet ideal for gifting.", descAr: "أسورة فاخرة متناسقة، مثالية كهدية.", price: 380 },
  ring: { name: "Royal Statement Ring", nameAr: "الخاتم الملكي البارز", desc: "An eye-catching ring with a bold feminine aesthetic.", descAr: "خاتم يخطف الأنظار بتصميم أنثوي جريء.", price: 320 },
  earring: { name: "Classic Luminous Earring", nameAr: "حلق اللمعان الكلاسيكي", desc: "Lightweight and elegant earrings.", descAr: "حلق خفيف الوزن وأنيق.", price: 290 },
  anklet: { name: "Delicate Summer Anklet", nameAr: "خلخال الصيف الرقيق", desc: "A subtle and beautiful anklet piece.", descAr: "خلخال رقيق وجميل.", price: 250 },
  handmade_bag: { name: "Artisan Hand-Stitched Bag", nameAr: "حقيبة يدوية الصنع (هاند ميد)", desc: "A unique, limited edition handmade bag.", descAr: "حقيبة يدوية فريدة من نوعها.", price: 1250 },
  set: { name: "Complete Luxury Set", nameAr: "طقم الفخامة المتكامل", desc: "A curated collection of matching pieces.", descAr: "مجموعة متناسقة من القطع الفاخرة.", price: 850 }
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
      status.textContent = "❌ Analysis Failed!";
    }
  });

  categorySelect.addEventListener("change", (e) => {
    fillDataFields(e.target.value);
    status.textContent = `⚡ Manual Fill: ${e.target.value.toUpperCase()}`;
  });
};

const initForm = () => {
  const form = document.querySelector("#dashboardForm");
  const submitBtn = form?.querySelector('button[type="submit"]');
  const statusLabel = document.querySelector("#aiStatus");

  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Saving to Cloud...";

    const productData = {
      id: editingProductId ? editingProductId : Date.now(),
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

    await saveProductToDB(productData);

    if (editingProductId) {
      statusLabel.textContent = "✅ Product Updated Globally!";
      editingProductId = null;
      submitBtn.style.background = "";
      submitBtn.style.borderColor = "";
      submitBtn.style.color = "";
    } else {
      statusLabel.textContent = "✅ Product Added Globally!";
    }

    submitBtn.textContent = "Add product to Store";
    submitBtn.disabled = false;
    form.reset();
    renderProductsList(getProducts());
  });
};

const initListActions = () => {
  document.addEventListener("click", async (event) => {
    const removeBtn = event.target.closest("[data-dashboard-remove]");
    if (removeBtn) {
      const id = Number(removeBtn.dataset.dashboardRemove);
      if(confirm("Are you sure you want to remove this product from the Cloud?")) {
         removeBtn.textContent = "⏳...";
         await removeProductFromDB(id);
         renderProductsList(getProducts());
      }
      return;
    }

    const editBtn = event.target.closest("[data-dashboard-edit]");
    if (editBtn) {
      const id = Number(editBtn.dataset.dashboardEdit);
      const product = getProducts().find(p => p.id === id);
      if (!product) return;

      document.querySelector("#productImage").value = product.image || "";
      document.querySelector("#productCategory").value = product.category || "necklace";
      document.querySelector("#productName").value = product.name || "";
      document.querySelector("#productNameAr").value = product.nameAr || "";
      document.querySelector("#productPrice").value = product.price || "";
      document.querySelector("#productDescription").value = product.description || "";
      document.querySelector("#productDescriptionAr").value = product.descriptionAr || "";
      document.querySelector("#productSlug").value = product.slug || "";
      document.querySelector("#productBadge").value = product.badge || "";
      document.querySelector("#productBadgeAr").value = product.badgeAr || "";
      document.querySelector("#productMaterial").value = product.material || "";
      document.querySelector("#productMaterialAr").value = product.materialAr || "";
      document.querySelector("#productAlt").value = product.alt || "";

      editingProductId = id;

      const submitBtn = document.querySelector("#dashboardForm button[type='submit']");
      if(submitBtn) {
        submitBtn.textContent = "Update Product (تحديث)";
        submitBtn.style.background = "#1D6F51"; 
        submitBtn.style.borderColor = "#1D6F51";
        submitBtn.style.color = "#fff";
      }

      document.querySelector("#aiStatus").textContent = "✏️ Editing Mode Active";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
};

const initBackupSystem = () => {
  const exportBtn = document.querySelector("#exportProductsBtn");
  const importBtn = document.querySelector("#importProductsBtn");
  const fileInput = document.querySelector("#importFileHidden");

  exportBtn?.addEventListener("click", () => {
    const products = getProducts();
    if (!products.length) { alert("No products to export!"); return; }
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `kawthar_backup_${new Date().toISOString().slice(0, 10)}.json`);
    link.click();
  });

  importBtn?.addEventListener("click", () => fileInput.click());
  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (confirm(`Import ${imported.length} products to Cloud?`)) {
            document.querySelector("#aiStatus").textContent = "⏳ Uploading to Firebase...";
            await saveProducts(imported);
            renderProductsList(getProducts());
            document.querySelector("#aiStatus").textContent = "🚀 Backup restored & uploaded!";
        }
      } catch (err) { alert("❌ Invalid backup file."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  });
};

const initReset = () => {
  document.querySelector("#resetProductsBtn")?.addEventListener("click", async () => {
    if (confirm("Are you sure? This will delete ALL products from Firebase!")) {
      document.querySelector("#aiStatus").textContent = "⏳ Deleting from Cloud...";
      await resetProducts();
      renderProductsList(getProducts());
      document.querySelector("#aiStatus").textContent = "🗑️ Cloud Cleared!";
    }
  });
};

const init = () => {
  renderProductsList(getProducts());
  initForm();
  initListActions();
  initReset();
  initProAI();
  initBackupSystem();

  // الحل هنا: إخفاء شاشة التحميل بمجرد ما الداتا توصل، سواء الصفحة حملت أو لسه!
  const splash = document.querySelector("#splashScreen");
  if (splash) {
    setTimeout(() => {
      splash.style.transition = "opacity 0.5s ease";
      splash.style.opacity = "0";
      setTimeout(() => splash.classList.add("hidden"), 500);
    }, 300);
  }
};

// تشغيل الكود فوراً لو الصفحة كانت خلصت تحميل بسبب تأخير فايربيز
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init(); 
}