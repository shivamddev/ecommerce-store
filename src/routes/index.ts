import { Router } from 'express';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import checkoutRoutes from './checkout.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/products', productRoutes);
router.use('/carts', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/admin', adminRoutes);

export default router;
