import { Router } from 'express';
import { createOrder, lookupOrder } from '../controllers/order.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();
router.post('/', upload.fields([{ name: 'previewImage', maxCount: 1 }, { name: 'paymentProofImage', maxCount: 1 }]), createOrder);
router.post('/lookup', lookupOrder);
export default router;
