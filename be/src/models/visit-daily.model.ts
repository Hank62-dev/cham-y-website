import { Schema, model } from 'mongoose';

const visitDailySchema = new Schema({
  date: { type: String, unique: true, index: true, required: true },
  visitorIds: { type: [String], default: [] },
  visits: { type: Number, default: 0 },
}, { timestamps: true });

export const VisitDaily = model('VisitDaily', visitDailySchema);
