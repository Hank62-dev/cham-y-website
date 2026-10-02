const KEY = 'cham-y-cart';
export const readCart = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
export const writeCart = (items) => { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new CustomEvent('cart-updated')); };
export function addToCart(product) { const current = readCart(); const found = current.find((item) => item.productId === product.id); writeCart(found ? current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { productId: product.id, productName: product.name, productImage: product.image, productType: 'READY', unitPrice: product.price || 0, quantity: 1 }]); }
export const cartTotal = (items) => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
