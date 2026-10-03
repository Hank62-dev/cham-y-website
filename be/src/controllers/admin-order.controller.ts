import type { Request, Response } from 'express';
import { Order } from '../models/order.model.js';
import { fail, ok } from '../utils/api.js';
import { ordersToWorkbook } from '../services/excel.service.js';
import { Product } from '../models/product.model.js';

export async function dashboard(_req: Request, res: Response) {
  const [totalOrders, completedOrders, pendingOrders, revenue] = await Promise.all([
    Order.countDocuments(), Order.countDocuments({ status: 'COMPLETED' }), Order.countDocuments({ status: { $in: ['PENDING', 'PROCESSING'] } }), Order.aggregate([{ $match: { status: 'COMPLETED' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
  ]);
  return ok(res, { totalOrders, completedOrders, pendingOrders, totalRevenue: revenue[0]?.total || 0 });
}

export async function listOrders(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const search = String(req.query.search || '').trim();
  const status = ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].includes(String(req.query.status)) ? String(req.query.status) : undefined;
  const query: any = {};
  if (status) query.status = status;
  if (search) query.$or = [{ orderCode: new RegExp(search, 'i') }, { 'customer.fullName': new RegExp(search, 'i') }, { 'customer.phone': new RegExp(search, 'i') }];
  const [data, total] = await Promise.all([Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), Order.countDocuments(query)]);
  return ok(res, { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function getOrder(req: Request, res: Response) {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return fail(res, 'Order not found', 404);
  return ok(res, order);
}

export async function updateStatus(req: Request, res: Response) {
  const status = req.body.status;
  const rejectionReason = String(req.body.rejectionReason || '').trim();
  if (!['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].includes(status)) return fail(res, 'Invalid status');
  if (status === 'REJECTED' && !rejectionReason) return fail(res, 'Vui lòng nhập lý do từ chối');
  const current = await Order.findById(req.params.id);
  if (!current) return fail(res, 'Order not found', 404);

  if (status === 'REJECTED' && current.status !== 'REJECTED' && current.stockReserved) {
    for (const item of current.items.filter((value) => value.productType === 'READY')) {
      await Product.updateOne({ productCode: item.productId }, { $inc: { stock: item.quantity } });
    }
    current.stockReserved = false;
  }

  if (status !== 'REJECTED' && current.status === 'REJECTED' && !current.stockReserved) {
    const reserved: Array<{ productId: string; quantity: number }> = [];
    try {
      for (const item of current.items.filter((value) => value.productType === 'READY')) {
        const product = await Product.findOne({ productCode: item.productId, active: true }).select('stock stockManaged');
        if (!product) throw new Error('Một sản phẩm trong đơn không còn khả dụng');
        if (!product.stockManaged) continue;
        const updated = await Product.findOneAndUpdate({ _id: product._id, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } }, { new: true });
        if (!updated) throw new Error(`Không đủ tồn kho cho ${item.productName}`);
        reserved.push({ productId: item.productId, quantity: item.quantity });
      }
      current.stockReserved = reserved.length > 0;
    } catch (error) {
      for (const item of reserved) await Product.updateOne({ productCode: item.productId }, { $inc: { stock: item.quantity } });
      return fail(res, error instanceof Error ? error.message : 'Không thể mở lại đơn', 400);
    }
  }

  current.status = status;
  current.completedAt = status === 'COMPLETED' ? new Date() : null;
  current.rejectionReason = status === 'REJECTED' ? rejectionReason : null;
  await current.save();
  return ok(res, current.toObject());
}

export async function exportOrders(req: Request, res: Response) {
  const query = ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].includes(String(req.query.status)) ? { status: req.query.status } : {};
  const buffer = ordersToWorkbook(await Order.find(query).sort({ createdAt: -1 }).lean());
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="cham-y-orders.xlsx"');
  return res.send(buffer);
}
