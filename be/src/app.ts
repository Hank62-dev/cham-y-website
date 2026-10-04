import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import productRoutes from './routes/product.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

export const app = express();
app.use(helmet());
const allowedOrigins = [env.frontendUrl, env.adminFrontendUrl]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ''));
allowedOrigins.push('http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174');
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '2mb' }));
app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }));
app.use('/api/admin', adminRoutes);
app.use(errorHandler);
