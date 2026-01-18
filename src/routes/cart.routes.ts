import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';

const router = Router();

router.get('/:cartId', (req, res) => cartController.getCart(req, res));
router.post('/:cartId/items', (req, res) => cartController.addItem(req, res));
router.put('/:cartId/items/:productId', (req, res) =>
	cartController.updateItem(req, res),
);
router.delete('/:cartId/items/:productId', (req, res) =>
	cartController.removeItem(req, res),
);

export default router;
