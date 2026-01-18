import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { sendSuccess, sendError, formatPrice } from '../utils/response.util';

export class CartController {
	getCart(req: Request, res: Response): void {
		const cartId = req.params.cartId as string;
		const cart = cartService.getOrCreateCart(cartId);

		sendSuccess(res, {
			id: cart.id,
			items: cart.items,
			itemCount: cartService.getItemCount(cart),
			subtotal: cartService.calculateSubtotal(cart),
			subtotalFormatted: formatPrice(cartService.calculateSubtotal(cart)),
		});
	}

	addItem(req: Request, res: Response): void {
		const cartId = req.params.cartId as string;
		const { productId, quantity } = req.body;

		if (!productId || typeof productId !== 'string') {
			sendError(res, 'INVALID_REQUEST', 'productId is required');
			return;
		}

		if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
			sendError(res, 'INVALID_REQUEST', 'quantity must be a positive number');
			return;
		}

		try {
			const cart = cartService.addItem(cartId, productId, quantity);
			sendSuccess(
				res,
				{
					id: cart.id,
					items: cart.items,
					itemCount: cartService.getItemCount(cart),
					subtotal: cartService.calculateSubtotal(cart),
					subtotalFormatted: formatPrice(cartService.calculateSubtotal(cart)),
				},
				'Item added to cart',
				201,
			);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			if (message === 'PRODUCT_NOT_FOUND') {
				sendError(res, 'PRODUCT_NOT_FOUND', 'Product not found', 404);
			} else if (message === 'INVALID_QUANTITY') {
				sendError(res, 'INVALID_QUANTITY', 'Quantity must be positive');
			} else {
				sendError(res, 'INTERNAL_ERROR', message, 500);
			}
		}
	}

	updateItem(req: Request, res: Response): void {
		const cartId = req.params.cartId as string;
		const productId = req.params.productId as string;
		const { quantity } = req.body;

		if (typeof quantity !== 'number' || quantity < 0) {
			sendError(
				res,
				'INVALID_REQUEST',
				'quantity must be a non-negative number',
			);
			return;
		}

		try {
			const cart = cartService.updateItemQuantity(cartId, productId, quantity);
			sendSuccess(
				res,
				{
					id: cart.id,
					items: cart.items,
					itemCount: cartService.getItemCount(cart),
					subtotal: cartService.calculateSubtotal(cart),
					subtotalFormatted: formatPrice(cartService.calculateSubtotal(cart)),
				},
				'Cart updated',
			);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			if (message === 'CART_NOT_FOUND') {
				sendError(res, 'CART_NOT_FOUND', 'Cart not found', 404);
			} else if (message === 'ITEM_NOT_FOUND') {
				sendError(res, 'ITEM_NOT_FOUND', 'Item not found in cart', 404);
			} else {
				sendError(res, 'INTERNAL_ERROR', message, 500);
			}
		}
	}

	removeItem(req: Request, res: Response): void {
		const cartId = req.params.cartId as string;
		const productId = req.params.productId as string;

		try {
			const cart = cartService.removeItem(cartId, productId);
			sendSuccess(
				res,
				{
					id: cart.id,
					items: cart.items,
					itemCount: cartService.getItemCount(cart),
					subtotal: cartService.calculateSubtotal(cart),
					subtotalFormatted: formatPrice(cartService.calculateSubtotal(cart)),
				},
				'Item removed from cart',
			);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			if (message === 'CART_NOT_FOUND') {
				sendError(res, 'CART_NOT_FOUND', 'Cart not found', 404);
			} else if (message === 'ITEM_NOT_FOUND') {
				sendError(res, 'ITEM_NOT_FOUND', 'Item not found in cart', 404);
			} else {
				sendError(res, 'INTERNAL_ERROR', message, 500);
			}
		}
	}
}

export const cartController = new CartController();
