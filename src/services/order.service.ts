import { store } from '../store';
import { Order } from '../models';
import { cartService } from './cart.service';
import { discountService } from './discount.service';

export interface CheckoutResult {
	order: Order;
	discountApplied: boolean;
	newDiscountCode: string | null;
}

export class OrderService {
	checkout(cartId: string, discountCode?: string): CheckoutResult {
		const cart = cartService.getCart(cartId);
		if (!cart) {
			throw new Error('CART_NOT_FOUND');
		}

		if (cart.items.length === 0) {
			throw new Error('CART_EMPTY');
		}

		const subtotal = cartService.calculateSubtotal(cart);
		let discountAmount = 0;
		let appliedDiscountCode: string | undefined;

		// Validate discount code if provided
		if (discountCode) {
			const validation = discountService.validateCode(discountCode);
			if (!validation.valid) {
				throw new Error('INVALID_DISCOUNT_CODE');
			}
			discountAmount = discountService.calculateDiscount(
				subtotal,
				validation.discount!.percentage,
			);
			appliedDiscountCode = discountCode;
		}

		const total = subtotal - discountAmount;
		const orderNumber = store.incrementOrderCounter();

		const order: Order = {
			id: `order_${orderNumber}_${new Date().getTime()}`,
			orderNumber,
			items: [...cart.items],
			subtotal,
			discountCode: appliedDiscountCode,
			discountAmount,
			total,
			createdAt: new Date(),
		};

		store.orders.set(order.id, order);

		// Mark discount code as used
		if (appliedDiscountCode) {
			discountService.markAsUsed(appliedDiscountCode, order.id);
		}

		// Clear the cart after successful order
		cartService.clearCart(cartId);

		// Check if this is nth order and generate new discount code
		let newDiscountCode: string | null = null;
		if (discountService.isNthOrder(orderNumber)) {
			const newCode = discountService.generateCode(orderNumber);
			newDiscountCode = newCode.code;
		}

		return {
			order,
			discountApplied: !!appliedDiscountCode,
			newDiscountCode,
		};
	}

	getOrder(orderId: string): Order | null {
		return store.orders.get(orderId) || null;
	}

	getAllOrders(): Order[] {
		return Array.from(store.orders.values());
	}
}

export const orderService = new OrderService();
