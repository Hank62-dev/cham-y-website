import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { fail, ok } from '../utils/api.js';

export async function adminLogin(req: Request, res: Response) {
  const password = String(req.body.password || '');
  if (!env.adminPasswordHash || !(await bcrypt.compare(password, env.adminPasswordHash))) return fail(res, 'Invalid admin password', 401);
  const token = jwt.sign({ role: 'admin' }, env.jwtSecret, { expiresIn: '12h' });
  return ok(res, { token });
}
