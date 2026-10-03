import mongoose from 'mongoose';
import { env } from './env.js';
import { seedInitialProducts } from '../services/product.service.js';

export async function connectDb() {
  if (!env.mongoUri) {
    console.warn('MONGODB_URI is not configured; database-backed routes will return an error.');
    return;
  }
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
  });
  console.log('MongoDB connected');
  await seedInitialProducts();
}
