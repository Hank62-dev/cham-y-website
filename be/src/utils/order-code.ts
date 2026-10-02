import { Order } from '../models/order.model.js';
import { randomInt } from 'node:crypto';

export async function makeOrderCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = `ORD-${date}-${String(randomInt(0, 10000)).padStart(4, '0')}`;
    if (!await Order.exists({ orderCode: code })) return code;
  }
  return `ORD-${date}-${Date.now().toString().slice(-8)}`;
}
