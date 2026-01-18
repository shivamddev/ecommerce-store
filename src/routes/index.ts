import { Router } from 'express';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';

const router = Router();

router.use('/products', productRoutes);
router.use('/carts', cartRoutes);

export default router;
