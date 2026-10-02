import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { fail } from '../utils/api.js';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return fail(res, 'Admin authentication required', 401);
  try {
    jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return fail(res, 'Invalid or expired admin token', 401);
  }
}
