import { Schema, model } from 'mongoose';

const imageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: null },
}, { _id: false });

const productSchema = new Schema({
  productCode: { type: String, required: true, unique: true, index: true, trim: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  description: { type: String, default: '', trim: true },
  type: { type: String, enum: ['READY'], default: 'READY', required: true },
  image: { type: imageSchema, required: true },
  accent: { type: String, default: '#f2ecdd' },
  charmCount: { type: Number, min: 1, max: 3, required: true },
  stock: { type: Number, min: 0, default: 0 },
  stockManaged: { type: Boolean, default: false },
  lowStockThreshold: { type: Number, min: 0, default: 3 },
  active: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ active: 1, sortOrder: 1 });
export const Product = model('Product', productSchema);
