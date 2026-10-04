import { Router } from 'express';
import { heartbeat } from '../controllers/analytics.controller.js';

const router = Router();
router.post('/heartbeat', heartbeat);
export default router;
