import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { sendSuccess, sendError, formatPrice } from '../utils/response.util';

export class CheckoutController {
	checkout(req: Request, res: Response): void {
		const { cartId, discountCode } = req.body;

		if (!cartId || typeof cartId !== 'string') {
			sendError(res, 'INVALID_REQUEST', 'cartId is required');
			return;
		}

		try {
			const result = orderService.checkout(cartId, discountCode);
			const { order, discountApplied, newDiscountCode } = result;

			let message = 'Order placed successfully';
			if (discountApplied) {
				message = 'Order placed successfully with 10% discount';
			}
			if (newDiscountCode) {
				message =
					'Congratulations! You earned a 10% discount code for your next order!';
			}

			sendSuccess(
				res,
				{
					orderId: order.id,
					orderNumber: order.orderNumber,
					items: order.items,
					subtotal: order.subtotal,
					subtotalFormatted: formatPrice(order.subtotal),
					discountApplied,
					discountCode: order.discountCode || null,
					discountAmount: order.discountAmount,
					discountAmountFormatted: formatPrice(order.discountAmount),
					total: order.total,
					totalFormatted: formatPrice(order.total),
					newDiscountCode,
				},
				message,
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			if (errorMessage === 'CART_NOT_FOUND') {
				sendError(res, 'CART_NOT_FOUND', 'Cart not found', 404);
			} else if (errorMessage === 'CART_EMPTY') {
				sendError(res, 'CART_EMPTY', 'Cannot checkout with an empty cart');
			} else if (errorMessage === 'INVALID_DISCOUNT_CODE') {
				sendError(
					res,
					'INVALID_DISCOUNT_CODE',
					'The discount code is invalid or has already been used',
				);
			} else {
				sendError(res, 'INTERNAL_ERROR', errorMessage, 500);
			}
		}
	}
}

export const checkoutController = new CheckoutController();
