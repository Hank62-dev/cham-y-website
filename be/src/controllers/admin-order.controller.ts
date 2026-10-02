import type { Request, Response } from 'express';
import { Order } from '../models/order.model.js';
import { fail, ok } from '../utils/api.js';
import { ordersToWorkbook } from '../services/excel.service.js';

export async function dashboard(_req: Request, res: Response) {
  const [totalOrders, completedOrders, pendingOrders, revenue] = await Promise.all([
    Order.countDocuments(), Order.countDocuments({ status: 'COMPLETED' }), Order.countDocuments({ status: 'PENDING' }), Order.aggregate([{ $match: { status: 'COMPLETED' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
  ]);
  return ok(res, { totalOrders, completedOrders, pendingOrders, totalRevenue: revenue[0]?.total || 0 });
}

export async function listOrders(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const search = String(req.query.search || '').trim();
  const status = ['PENDING', 'COMPLETED', 'REJECTED'].includes(String(req.query.status)) ? String(req.query.status) : undefined;
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
  if (!['PENDING', 'COMPLETED', 'REJECTED'].includes(status)) return fail(res, 'Invalid status');
  if (status === 'REJECTED' && !rejectionReason) return fail(res, 'Vui lòng nhập lý do từ chối');
  const order = await Order.findByIdAndUpdate(req.params.id, { status, completedAt: status === 'COMPLETED' ? new Date() : null, rejectionReason: status === 'REJECTED' ? rejectionReason : null }, { new: true }).lean();
  if (!order) return fail(res, 'Order not found', 404);
  return ok(res, order);
}

export async function exportOrders(req: Request, res: Response) {
  const query = ['PENDING', 'COMPLETED', 'REJECTED'].includes(String(req.query.status)) ? { status: req.query.status } : {};
  const buffer = ordersToWorkbook(await Order.find(query).sort({ createdAt: -1 }).lean());
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="cham-y-orders.xlsx"');
  return res.send(buffer);
}
