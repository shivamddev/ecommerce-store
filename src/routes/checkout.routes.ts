import { Router } from 'express';
import { checkoutController } from '../controllers/checkout.controller';

const router = Router();

router.post('/', (req, res) => checkoutController.checkout(req, res));

export default router;
