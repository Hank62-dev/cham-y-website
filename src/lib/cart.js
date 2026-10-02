const KEY = 'cham-y-cart';
export const readCart = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
export const writeCart = (items) => { localStorage.setItem(KEY, JSON.stringify(items)); window.dispatchEvent(new CustomEvent('cart-updated')); };
export function addToCart(product, customizationData, unitPrice) { const current = readCart(); const found = current.find((item) => item.productId === product.id); const details = customizationData ? { customizationData, unitPrice: unitPrice || product.price || 0 } : {}; writeCart(found ? current.map((item) => item.productId === product.id ? { ...item, ...details, quantity: item.quantity + 1 } : item) : [...current, { productId: product.id, productName: product.name, productImage: product.image, productType: 'READY', unitPrice: unitPrice || product.price || 0, quantity: 1, ...details }]); }
export const cartTotal = (items) => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
