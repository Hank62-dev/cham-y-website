import { Schema, model } from 'mongoose';

const visitorSchema = new Schema({
  visitorId: { type: String, unique: true, index: true, required: true },
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export const Visitor = model('Visitor', visitorSchema);
