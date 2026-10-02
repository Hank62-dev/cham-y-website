import { z } from 'zod';

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

const readyPrices: Record<string, number> = {
  'japanese-wish': 96000,
  'sunny-dream': 95000,
  'sweet-love': 96000,
};

function serverUnitPrice(item: z.infer<typeof orderInputSchema>['items'][number]) {
  if (item.productType === 'CUSTOM') {
    const count = Number((item.customizationData as { selectedCount?: number } | undefined)?.selectedCount || 1);
    const letters = String((item.customizationData as { letters?: string } | undefined)?.letters || '').length;
    const priceTable: Record<number, Record<number, number>> = {
      2: { 1: 86000, 2: 88000, 3: 89000 },
      3: { 1: 87000, 2: 89000, 3: 91000 },
      4: { 1: 89000, 2: 90000, 3: 92000 },
      5: { 1: 90000, 2: 92000, 3: 94000 },
    };
    return priceTable[letters]?.[count] ?? 0;
  }
  return readyPrices[item.productId] ?? item.unitPrice;
}

export function calculateOrder(input: z.infer<typeof orderInputSchema>) {
  const items = input.items.map((item) => {
    const unitPrice = serverUnitPrice(item);
    return { ...item, unitPrice, subtotal: unitPrice * item.quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { items, subtotal, totalAmount: subtotal };
}
