import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { fail, ok } from '../utils/api.js';

export async function adminLogin(req: Request, res: Response) {
  const password = String(req.body.password || '');
  if (!env.adminPasswordHash || !(await bcrypt.compare(password, env.adminPasswordHash))) return fail(res, 'Invalid admin password', 401);
  const payload = { role: 'admin' };
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: '12h' });
  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: '30d' });
  return ok(res, { token, refreshToken });
}

export async function refreshAdminToken(req: Request, res: Response) {
  const refreshToken = String(req.body.refreshToken || '');
  if (!refreshToken) return fail(res, 'Refresh token is required', 401);
  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as { role?: string };
    if (payload.role !== 'admin') return fail(res, 'Invalid refresh token', 401);
    const token = jwt.sign({ role: 'admin' }, env.jwtSecret, { expiresIn: '12h' });
    return ok(res, { token, refreshToken });
  } catch {
    return fail(res, 'Invalid or expired refresh token', 401);
  }
}
