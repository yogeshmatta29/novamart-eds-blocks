
const CART_KEY = 'novamart-cart';

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find(
    (item) => item.name === product.name,
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));

  return cart;
}

export function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}


export function updateCartQuantity(productName, change) {
  const cart = getCart();
  const item = cart.find((product) => product.name === productName);

  if (!item) return cart;

  item.quantity += change;

  const updatedCart = cart.filter((product) => product.quantity > 0);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  window.dispatchEvent(new Event('cart-updated'));

  return updatedCart;
}

export function removeFromCart(productName) {
  const updatedCart = getCart().filter(
    (product) => product.name !== productName,
  );

  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  window.dispatchEvent(new Event('cart-updated'));

  return updatedCart;
}


export function clearCart() {
  localStorage.removeItem('novamart-cart');
  window.dispatchEvent(new Event('cart-updated'));
}


