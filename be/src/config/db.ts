import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  if (!env.mongoUri) {
    console.warn('MONGODB_URI is not configured; database-backed routes will return an error.');
    return;
  }
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
}
