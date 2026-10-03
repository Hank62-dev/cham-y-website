import type { Request, Response } from 'express';
import { Order } from '../models/order.model.js';
import { makeOrderCode } from '../utils/order-code.js';
import { fail, ok } from '../utils/api.js';
import { calculateOrder, orderInputSchema } from '../services/order.service.js';
import { uploadImage } from '../services/upload.service.js';
import { env } from '../config/env.js';

function absoluteProductImage(image: string) {
  if (!image || /^https?:\/\//i.test(image)) return image;
  return `${env.frontendUrl.replace(/\/$/, '')}/${image.replace(/^\//, '').split(' ').map(encodeURIComponent).join('%20')}`;
}

function parsePayload(req: Request) {
  const raw = typeof req.body.payload === 'string' ? JSON.parse(req.body.payload) : req.body;
  return orderInputSchema.parse(raw);
}

export async function createOrder(req: Request, res: Response) {
  try {
    const input = parsePayload(req);
    if (input.items.some((item) => item.productType === 'CUSTOM') && input.items.length > 1) return fail(res, 'Custom product must be ordered separately');
    const calculated = calculateOrder(input);
    calculated.items = calculated.items.map((item) => ({ ...item, productImage: absoluteProductImage(item.productImage) }));
    const files = (req.files || {}) as { [fieldname: string]: Express.Multer.File[] };
    const previewImage = await uploadImage(files.previewImage?.[0], input.previewImageUrl);
    const paymentProofImage = await uploadImage(files.paymentProofImage?.[0]);
    if (!paymentProofImage) return fail(res, 'Payment proof image is required');
    const order = await Order.create({
      orderCode: await makeOrderCode(),
      customer: input.customer,
      items: calculated.items,
      previewImage,
      paymentProofImage,
      subtotal: calculated.subtotal,
      totalAmount: calculated.totalAmount,
      status: 'PENDING',
    });
    return ok(res, order, 201);
  } catch (error: any) {
    return fail(res, error?.issues?.[0]?.message || error.message || 'Cannot create order', 400);
  }
}

export async function lookupOrder(req: Request, res: Response) {
  const phone = String(req.body.phone || '').trim();
  if (!phone) return fail(res, 'Phone is required');
  const orders = await Order.find({ 'customer.phone': phone }).sort({ createdAt: -1 }).lean();
  if (!orders.length) return fail(res, 'No orders found', 404);
  return ok(res, orders);
}
