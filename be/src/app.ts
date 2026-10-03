import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export const app = express();
app.use(helmet());
const allowedOrigins = [env.frontendUrl, env.adminFrontendUrl]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ''));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '2mb' }));
app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api/orders', orderRoutes);
app.use('/api/admin/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }));
app.use('/api/admin', adminRoutes);
app.use(errorHandler);
