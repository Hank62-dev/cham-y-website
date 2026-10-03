import { z } from 'zod';
import { Product } from '../models/product.model.js';
import { getMatrixPrice } from '../config/pricing.js';

export const orderInputSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2).max(120),
    phone: z.string().trim().regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/),
    address: z.string().trim().min(5).max(300),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    productName: z.string().min(1),
    productImage: z.string().optional().default(''),
    productType: z.enum(['READY', 'CUSTOM']),
    quantity: z.number().int().min(1).max(20),
    unitPrice: z.number().nonnegative(),
    customizationData: z.unknown().optional(),
  })).min(1),
  previewImageUrl: z.string().url().optional(),
});

async function serverUnitPrice(item: z.infer<typeof orderInputSchema>['items'][number], product?: any) {
  if (item.productType === 'CUSTOM') {
    const count = Number((item.customizationData as { selectedCount?: number } | undefined)?.selectedCount || 1);
    const letters = String((item.customizationData as { letters?: string } | undefined)?.letters || '').length;
    return getMatrixPrice(letters, count);
  }
  if (!product || !product.active) return 0;
  const letters = String((item.customizationData as { letters?: string } | undefined)?.letters || '').length;
  return getMatrixPrice(letters, product.charmCount);
}

export async function calculateOrder(input: z.infer<typeof orderInputSchema>) {
  const readyIds = input.items.filter((item) => item.productType === 'READY').map((item) => item.productId);
  const products = await Product.find({ productCode: { $in: readyIds }, active: true }).lean();
  const productMap = new Map(products.map((product) => [product.productCode, product]));
  const items = await Promise.all(input.items.map(async (item) => {
    const product = item.productType === 'READY' ? productMap.get(item.productId) : undefined;
    const unitPrice = await serverUnitPrice(item, product);
    if (item.productType === 'READY' && !product) throw new Error('Product is not available');
    if (!unitPrice) throw new Error('Invalid product price configuration');
    const productName = product?.name || item.productName;
    const productImage = product?.image?.url || item.productImage;
    return { ...item, productName, productImage, unitPrice, subtotal: unitPrice * item.quantity };
  }));
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { items, subtotal, totalAmount: subtotal };
}
