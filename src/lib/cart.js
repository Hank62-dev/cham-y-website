const KEY = 'cham-y-cart';
export const readCart = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
export const writeCart = (items) => { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new CustomEvent('cart-updated')); };
// Cùng một mẫu nhưng khác tên là hai dòng khác nhau trong giỏ.
export const cartKey = (item) => `${item.productId}::${item.customizationData?.letters || ''}`;
export function addToCart(product, customizationData, unitPrice) {
  const current = readCart();
  const productId = product.id || product.productCode || product.slug;
  const key = cartKey({ productId, customizationData });
  const price = unitPrice || product.price || 0;
  const details = customizationData ? { customizationData, unitPrice: price } : {};
  const found = current.some((item) => cartKey(item) === key);
  writeCart(found
    ? current.map((item) => cartKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item)
    : [...current, { productId, productName: product.name, productImage: product.image, productType: 'READY', charmCount: product.charmCount, unitPrice: price, quantity: 1, ...details }]);
}
export const cartTotal = (items) => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
