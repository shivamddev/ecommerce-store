import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';

const router = Router();

router.get('/stats', (req, res) => adminController.getStats(req, res));
router.post('/discount/generate', (req, res) =>
	adminController.generateDiscount(req, res),
);

export default router;
