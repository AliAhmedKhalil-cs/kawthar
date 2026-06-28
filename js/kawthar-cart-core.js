(function () {
  "use strict";

  const AUTHORITATIVE_KEY = "kawtharabdo_cart";

  const CART_KEYS = [
    "kawtharabdo_cart",
    "kaw_cart",
    "cart",
    "kawtharabdo_selection",
    "selection"
  ];

  const MAX_QTY = 20;
  const MAX_REASONABLE_PRICE = 100000;

  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;

  let writeLock = false;

  function safeJson(value) {
    try {
      const data = JSON.parse(value || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function cleanText(value, fallback) {
    return String(value || fallback || "").trim();
  }

  function productName(item) {
    if (typeof item.name === "string") return cleanText(item.name, "KAWTHAR product");
    if (item.name && typeof item.name.en === "string") return cleanText(item.name.en, "KAWTHAR product");
    if (item.name && typeof item.name.ar === "string") return cleanText(item.name.ar, "KAWTHAR product");
    if (item.title) return cleanText(item.title, "KAWTHAR product");
    return "KAWTHAR product";
  }

  function productCategory(item) {
    const value = cleanText(
      item.category || item.type || item.collection || "Stainless Steel Anti Rust",
      "Stainless Steel Anti Rust"
    );

    if (["set", "product", "category", "item"].includes(value.toLowerCase())) {
      return "Stainless Steel Anti Rust";
    }

    return value;
  }

  function productImage(item) {
    return cleanText(
      item.image || item.img || item.thumbnail || item.photo || item.src || "./assets/logo/kawthar-logo-hd.webp?v=logo-1782681526",
      "./assets/logo/kawthar-logo-hd.webp?v=logo-1782681526"
    );
  }

  function productPrice(item) {
    let raw = item.price ?? item.salePrice ?? item.finalPrice ?? item.unitPrice ?? 0;

    if (typeof raw === "string") {
      raw = raw.replace(/,/g, "").replace(/[^\d.]/g, "");
    }

    const n = Number(raw);

    if (!Number.isFinite(n) || n < 0) return 0;
    if (n > MAX_REASONABLE_PRICE) return 0;

    return Math.round(n);
  }

  function productQty(item) {
    let raw = item.quantity ?? item.qty ?? item.count ?? 1;

    if (typeof raw === "string") {
      raw = raw.replace(/,/g, "").replace(/[^\d.]/g, "");
    }

    const n = Number(raw);

    if (!Number.isFinite(n) || n < 1) return 1;

    /*
      Critical protection:
      If quantity became astronomical from previous broken sync,
      treat it as corrupted and reset it to 1.
    */
    if (n > MAX_QTY) return 1;

    return Math.max(1, Math.round(n));
  }

  function slug(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function mergeKey(item) {
    /*
      Merge same product by name + price.
      This fixes the bug where the same product appears twice
      because one script saved category as "set" and another saved full category.
    */
    return `${slug(productName(item))}|${productPrice(item)}`;
  }

  function normalize(item, index) {
    const name = productName(item);
    const price = productPrice(item);
    const quantity = productQty(item);
    const category = productCategory(item);
    const image = productImage(item);
    const key = mergeKey(item) || `kaw-item-${index}`;

    return {
      ...item,
      id: item.id || item.productId || item.slug || key,
      productId: item.productId || item.id || item.slug || key,
      name,
      title: item.title || name,
      category,
      image,
      img: item.img || image,
      price,
      quantity,
      qty: quantity
    };
  }

  function betterImage(a, b) {
    const aa = productImage(a);
    const bb = productImage(b);

    if (aa.includes("logo") && !bb.includes("logo")) return bb;
    return aa || bb;
  }

  function betterCategory(a, b) {
    const aa = productCategory(a);
    const bb = productCategory(b);

    if (aa === "Stainless Steel Anti Rust") return bb || aa;
    return aa || bb || "Stainless Steel Anti Rust";
  }

  function mergeCart(items) {
    const map = new Map();

    (Array.isArray(items) ? items : []).forEach((raw, index) => {
      const item = normalize(raw, index);
      const key = mergeKey(item);

      if (!map.has(key)) {
        map.set(key, item);
        return;
      }

      const old = map.get(key);
      const nextQty = Math.min(MAX_QTY, productQty(old) + productQty(item));

      map.set(key, {
        ...old,
        ...item,
        id: old.id || item.id,
        productId: old.productId || item.productId,
        name: productName(old) || productName(item),
        title: old.title || item.title || productName(item),
        category: betterCategory(old, item),
        image: betterImage(old, item),
        img: betterImage(old, item),
        price: productPrice(old) || productPrice(item),
        quantity: nextQty,
        qty: nextQty
      });
    });

    return Array.from(map.values()).filter((item) => productName(item));
  }

  function firstValidCart() {
    /*
      Important:
      Do NOT read all keys and sum them.
      That was the reason quantities multiplied into millions.
      Read the first valid cart only, then write the cleaned version to all keys.
    */
    for (const key of CART_KEYS) {
      const data = safeJson(localStorage.getItem(key));
      if (data.length) {
        return mergeCart(data);
      }
    }

    return [];
  }

  function directWriteAll(items) {
    const clean = mergeCart(items);

    writeLock = true;

    CART_KEYS.forEach((key) => {
      try {
        originalSetItem.call(localStorage, key, JSON.stringify(clean));
      } catch {}
    });

    writeLock = false;

    updateBadges(clean);

    try {
      window.dispatchEvent(new CustomEvent("kawtharabdo:cart-updated", { detail: clean }));
    } catch {}

    return clean;
  }

  function updateBadges(items) {
    const count = mergeCart(items).reduce((sum, item) => sum + productQty(item), 0);

    document.querySelectorAll(
      "[data-cart-count], .cart-count, .selection-count, #cartCount, #cartCounter"
    ).forEach((el) => {
      el.textContent = String(count);
    });
  }

  function read() {
    const clean = firstValidCart();
    directWriteAll(clean);
    return clean;
  }

  function write(items) {
    return directWriteAll(items);
  }

  function add(item) {
    const current = read();
    const next = mergeCart([...current, normalize(item, current.length)]);
    return write(next);
  }

  function clear() {
    writeLock = true;

    CART_KEYS.forEach((key) => {
      try {
        originalRemoveItem.call(localStorage, key);
      } catch {}
    });

    writeLock = false;

    updateBadges([]);

    try {
      window.dispatchEvent(new CustomEvent("kawtharabdo:cart-updated", { detail: [] }));
    } catch {}

    return [];
  }

  function forceClean() {
    return write(read());
  }

  /*
    Intercept old scripts.
    If any old script writes duplicate rows or corrupted quantities,
    clean them before storage accepts them.
  */
  Storage.prototype.setItem = function (key, value) {
    if (writeLock || !CART_KEYS.includes(key)) {
      return originalSetItem.call(this, key, value);
    }

    try {
      const data = JSON.parse(value || "[]");

      if (Array.isArray(data)) {
        const clean = mergeCart(data);

        writeLock = true;

        CART_KEYS.forEach((cartKey) => {
          try {
            originalSetItem.call(localStorage, cartKey, JSON.stringify(clean));
          } catch {}
        });

        writeLock = false;

        updateBadges(clean);

        setTimeout(() => {
          try {
            window.dispatchEvent(new CustomEvent("kawtharabdo:cart-updated", { detail: clean }));
          } catch {}
        }, 0);

        return;
      }
    } catch {}

    return originalSetItem.call(this, key, value);
  };

  window.KawtharCart = {
    keys: CART_KEYS,
    authorKey: AUTHORITATIVE_KEY,
    maxQty: MAX_QTY,
    read,
    write,
    add,
    clear,
    forceClean,
    merge: mergeCart,
    normalize,
    qtyOf: productQty,
    priceOf: productPrice,
    nameOf: productName,
    imageOf: productImage,
    categoryOf: productCategory
  };

  function boot() {
    forceClean();

    document.addEventListener("click", () => {
      setTimeout(forceClean, 120);
      setTimeout(forceClean, 500);
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  console.info("KAWTHAR Cart Core FINAL MATH FIX loaded.");
})();
