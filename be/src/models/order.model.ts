import { Schema, model } from 'mongoose';

const imageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: null },
}, { _id: false });

const itemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, default: '' },
  productType: { type: String, enum: ['READY', 'CUSTOM'], required: true },
  quantity: { type: Number, min: 1, required: true },
  unitPrice: { type: Number, min: 0, required: true },
  subtotal: { type: Number, min: 0, required: true },
  customizationData: { type: Schema.Types.Mixed, default: null },
}, { _id: false });

const orderSchema = new Schema({
  orderCode: { type: String, unique: true, index: true, required: true },
  customer: {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
  },
  items: { type: [itemSchema], required: true },
  previewImage: { type: imageSchema, default: null },
  paymentProofImage: { type: imageSchema, default: null },
  subtotal: { type: Number, min: 0, required: true },
  totalAmount: { type: Number, min: 0, required: true },
  status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING', index: true },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.fullName': 'text' });

export const Order = model('Order', orderSchema);
