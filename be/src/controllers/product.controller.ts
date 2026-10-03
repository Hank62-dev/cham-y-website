import type { Request, Response } from 'express';
import { Product } from '../models/product.model.js';
import { fail, ok } from '../utils/api.js';
import { serializeProduct } from '../services/product.service.js';
import { uploadImage } from '../services/upload.service.js';
import { env } from '../config/env.js';

function bodyNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function serializeAdminProduct(product: any) {
  const value = serializeProduct(product);
  if (value.image && !/^https?:\/\//i.test(value.image)) value.image = `${env.frontendUrl.replace(/\/$/, '')}/${value.image.replace(/^\//, '').split(' ').map(encodeURIComponent).join('%20')}`;
  return value;
}

export async function listPublicProducts(_req: Request, res: Response) {
  const products = await Product.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
  return ok(res, products.map(serializeProduct));
}

export async function getPublicProduct(req: Request, res: Response) {
  const product = await Product.findOne({ active: true, $or: [{ productCode: req.params.id }, { slug: req.params.id }] }).lean();
  if (!product) return fail(res, 'Product not found', 404);
  return ok(res, serializeProduct(product));
}

export async function listAdminProducts(req: Request, res: Response) {
  const search = String(req.query.search || '').trim();
  const query: any = {};
  if (req.query.active === 'true') query.active = true;
  if (req.query.active === 'false') query.active = false;
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { productCode: new RegExp(search, 'i') }];
  const products = await Product.find(query).sort({ sortOrder: 1, createdAt: 1 }).lean();
  return ok(res, products.map(serializeAdminProduct));
}

export async function getAdminProduct(req: Request, res: Response) {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return fail(res, 'Product not found', 404);
  return ok(res, serializeAdminProduct(product));
}

export async function createProduct(req: Request, res: Response) {
  try {
    const image = await uploadImage((req.files as { image?: Express.Multer.File[] })?.image?.[0], req.body.imageUrl, 'cham-y/products');
    if (!image) return fail(res, 'Product image is required', 400);
    const product = await Product.create({ productCode: String(req.body.productCode || '').trim(), name: String(req.body.name || '').trim(), slug: String(req.body.slug || req.body.productCode || '').trim().toLowerCase(), description: String(req.body.description || '').trim(), type: 'READY', image, accent: String(req.body.accent || '#f2ecdd'), charmCount: bodyNumber(req.body.charmCount), stock: bodyNumber(req.body.stock), stockManaged: req.body.stockManaged === 'true', lowStockThreshold: bodyNumber(req.body.lowStockThreshold, 3), active: req.body.active !== 'false', sortOrder: bodyNumber(req.body.sortOrder) });
    return ok(res, serializeAdminProduct(product), 201);
  } catch (error: any) { return fail(res, error?.code === 11000 ? 'Product code or slug already exists' : error.message, 400); }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) return fail(res, 'Product not found', 404);
    const image = await uploadImage((req.files as { image?: Express.Multer.File[] })?.image?.[0], req.body.imageUrl, 'cham-y/products');
    const updates: any = { name: String(req.body.name ?? current.name).trim(), slug: String(req.body.slug ?? current.slug).trim().toLowerCase(), description: String(req.body.description ?? current.description).trim(), accent: String(req.body.accent ?? current.accent), charmCount: bodyNumber(req.body.charmCount, current.charmCount), stock: bodyNumber(req.body.stock, current.stock), stockManaged: req.body.stockManaged === undefined ? current.stockManaged : req.body.stockManaged === 'true', lowStockThreshold: bodyNumber(req.body.lowStockThreshold, current.lowStockThreshold), active: req.body.active === undefined ? current.active : req.body.active !== 'false', sortOrder: bodyNumber(req.body.sortOrder, current.sortOrder) };
    if (image) updates.image = image;
    Object.assign(current, updates);
    await current.save();
    return ok(res, serializeAdminProduct(current));
  } catch (error: any) { return fail(res, error?.code === 11000 ? 'Product code or slug already exists' : error.message, 400); }
}

export async function updateProductStock(req: Request, res: Response) {
  const amount = Number(req.body.amount);
  if (!Number.isInteger(amount)) return fail(res, 'Stock amount must be an integer', 400);
  const product = await Product.findOneAndUpdate({ _id: req.params.id, ...(amount < 0 ? { stock: { $gte: Math.abs(amount) } } : {}) }, { $inc: { stock: amount }, $set: { stockManaged: true } }, { new: true }).lean();
  if (!product) return fail(res, amount < 0 ? 'Stock cannot be negative' : 'Product not found', 400);
  return ok(res, serializeAdminProduct(product));
}

export async function toggleProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndUpdate(req.params.id, { active: Boolean(req.body.active) }, { new: true }).lean();
  if (!product) return fail(res, 'Product not found', 404);
  return ok(res, serializeAdminProduct(product));
}

export async function deleteProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndDelete(req.params.id).lean();
  if (!product) return fail(res, 'Product not found', 404);
  return ok(res, { deleted: true, id: req.params.id });
}
