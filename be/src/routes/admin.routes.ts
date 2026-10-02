import { Router } from 'express';
import { adminLogin } from '../controllers/auth.controller.js';
import { dashboard, exportOrders, getOrder, listOrders, updateStatus } from '../controllers/admin-order.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/login', adminLogin);
router.use(requireAdmin);
router.get('/dashboard', dashboard);
router.get('/orders', listOrders);
router.get('/orders/export', exportOrders);
router.get('/orders/:id', getOrder);
router.patch('/orders/:id/status', updateStatus);
export default router;
