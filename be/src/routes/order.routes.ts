import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createOrder, lookupOrder } from '../controllers/order.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau ít phút.' },
});

const router = Router();
router.post('/', upload.fields([{ name: 'previewImage', maxCount: 1 }, { name: 'paymentProofImage', maxCount: 1 }]), createOrder);
router.post('/lookup', lookupLimiter, lookupOrder);
export default router;
