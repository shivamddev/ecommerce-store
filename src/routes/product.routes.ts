import { Router } from 'express';
import { productController } from '../controllers/product.contoller';

const router = Router();

router.get('/', (req, res) => productController.getAllProducts(req, res));

export default router;
