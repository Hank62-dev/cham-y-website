import { Product } from '../models/product.model.js';

const initialProducts = [
  { productCode: 'japanese-wish', name: 'Japanese Wish', slug: 'japanese-wish', description: 'Mẫu dây charm nhẹ nhàng, trong trẻo và đáng yêu.', image: { url: '/SẢN PHẨM/Japanese Wish.png', publicId: null }, accent: '#e8c7cf', charmCount: 3, stock: 0, stockManaged: false, sortOrder: 1 },
  { productCode: 'sunny-dream', name: 'Sunny Dream', slug: 'sunny-dream', description: 'Mẫu phối tươi sáng với những chi tiết nhỏ đầy năng lượng.', image: { url: '/SẢN PHẨM/Sunny Dream.png', publicId: null }, accent: '#d9c26f', charmCount: 2, stock: 0, stockManaged: false, sortOrder: 2 },
  { productCode: 'sweet-love', name: 'Sweet Love', slug: 'sweet-love', description: 'Mẫu phối ngọt ngào, mềm mại và có một chút lấp lánh.', image: { url: '/SẢN PHẨM/Sweet Love.png', publicId: null }, accent: '#ed9fc0', charmCount: 3, stock: 0, stockManaged: false, sortOrder: 3 },
];

export async function seedInitialProducts() {
  for (const product of initialProducts) await Product.updateOne({ productCode: product.productCode }, { $setOnInsert: product }, { upsert: true });
}

export function serializeProduct(product: any) {
  const value = typeof product.toObject === 'function' ? product.toObject() : product;
  return { ...value, image: value.image?.url || '', imageMeta: value.image || null };
}
