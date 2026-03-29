import { CONFIG } from "./config.js";

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const normalizeCartItem = (item) => ({
  ...item,
  quantity: Math.max(1, Number(item.quantity) || 1)
});

export const Store = {
  getCart() {
    return read(CONFIG.storageKeys.cart).map(normalizeCartItem);
  },

  setCart(items) {
    write(CONFIG.storageKeys.cart, items.map(normalizeCartItem));
  },

  addToCart(product) {
    const cart = this.getCart();
    const index = cart.findIndex((item) => item.id === product.id);

    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push(normalizeCartItem({ ...product, quantity: 1 }));
    }

    this.setCart(cart);
    return this.getCart();
  },

  increaseCartItem(id) {
    const cart = this.getCart().map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    this.setCart(cart);
    return cart;
  },

  decreaseCartItem(id) {
    const cart = this.getCart()
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    this.setCart(cart);
    return cart;
  },

  removeFromCart(id) {
    const cart = this.getCart().filter((item) => item.id !== id);
    this.setCart(cart);
    return cart;
  },

  getWishlist() {
    return read(CONFIG.storageKeys.wishlist);
  },

  setWishlist(items) {
    write(CONFIG.storageKeys.wishlist, items);
  },

  toggleWishlist(product) {
    const wishlist = this.getWishlist();
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      const next = wishlist.filter((item) => item.id !== product.id);
      this.setWishlist(next);
      return next;
    }

    wishlist.push(product);
    this.setWishlist(wishlist);
    return wishlist;
  },

  removeFromWishlist(id) {
    const wishlist = this.getWishlist().filter((item) => item.id !== id);
    this.setWishlist(wishlist);
    return wishlist;
  },

  isWishlisted(id) {
    return this.getWishlist().some((item) => item.id === id);
  }
};