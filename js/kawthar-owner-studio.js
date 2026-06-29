(function () {
  "use strict";

  const STORAGE_KEY = "kawthar_owner_product_updates_v1";
  let products = load();
  let currentImage = "";

  const form = document.getElementById("productForm");
  const imageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("imagePreview");
  const productsList = document.getElementById("productsList");
  const downloadJsonBtn = document.getElementById("downloadJsonBtn");
  const copyTextBtn = document.getElementById("copyTextBtn");
  const clearBtn = document.getElementById("clearBtn");

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  function fileToCompressedDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          const max = 1100;
          let width = img.width;
          let height = img.height;

          if (width > height && width > max) {
            height = Math.round(height * (max / width));
            width = max;
          } else if (height > max) {
            width = Math.round(width * (max / height));
            height = max;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#f5eee7";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/webp", 0.82);
          resolve(dataUrl);
        };

        img.onerror = reject;
        img.src = reader.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  imageInput.addEventListener("change", async () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;

    imagePreview.innerHTML = "<span>Preparing image...</span>";

    try {
      currentImage = await fileToCompressedDataUrl(file);
      imagePreview.innerHTML = `<img src="${currentImage}" alt="Product preview">`;
    } catch {
      currentImage = "";
      imagePreview.innerHTML = "<span>Could not read this image. Try another one.</span>";
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const category = document.getElementById("productCategory").value;
    const note = document.getElementById("productNote").value.trim();

    if (!name || !price || !currentImage) {
      alert("Please add product name, price, and image.");
      return;
    }

    products.push({
      id: "owner-" + Date.now(),
      name,
      price,
      category,
      note,
      image: currentImage,
      createdAt: new Date().toISOString()
    });

    save();
    render();

    form.reset();
    currentImage = "";
    imagePreview.innerHTML = "<span>Image preview will appear here</span>";
  });

  function render() {
    if (!products.length) {
      productsList.innerHTML = `<p class="empty">No products added yet.</p>`;
      return;
    }

    productsList.innerHTML = products.map((p, index) => `
      <article class="product-row">
        <img src="${p.image}" alt="">
        <div>
          <h3>${escapeHtml(p.name)} — EGP ${Number(p.price || 0)}</h3>
          <p>${escapeHtml(p.category)}${p.note ? " · " + escapeHtml(p.note) : ""}</p>
        </div>
        <button class="remove-product" type="button" data-index="${index}">Remove</button>
      </article>
    `).join("");

    productsList.querySelectorAll(".remove-product").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        products.splice(index, 1);
        save();
        render();
      });
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  downloadJsonBtn.addEventListener("click", () => {
    if (!products.length) {
      alert("Add products first.");
      return;
    }

    const payload = {
      brand: "KAWTHAR",
      type: "product_update_request",
      createdAt: new Date().toISOString(),
      products
    };

    download(
      "kawthar-product-update-" + new Date().toISOString().slice(0, 10) + ".json",
      JSON.stringify(payload, null, 2)
    );
  });

  copyTextBtn.addEventListener("click", async () => {
    if (!products.length) {
      alert("Add products first.");
      return;
    }

    const summary = products.map((p, i) => {
      return `${i + 1}. ${p.name} — EGP ${p.price} — ${p.category}${p.note ? " — " + p.note : ""}`;
    }).join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      alert("Summary copied.");
    } catch {
      alert(summary);
    }
  });

  clearBtn.addEventListener("click", () => {
    if (!confirm("Clear all added products from this browser?")) return;
    products = [];
    save();
    render();
  });

  render();
})();
