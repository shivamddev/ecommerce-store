import { orderService } from '../../services/order.service';
import { cartService } from '../../services/cart.service';
import { discountService } from '../../services/discount.service';
import { store } from '../../store';
import { config } from '../../config';

describe('OrderService', () => {
	const cartId = 'test-cart';

	beforeEach(() => {
		cartService.addItem(cartId, 'prod_1', 2); // T-Shirt x2 = 5998
	});

	describe('checkout', () => {
		it('should create an order successfully', () => {
			const result = orderService.checkout(cartId);

			expect(result.order).toBeDefined();
			expect(result.order.items).toHaveLength(1);
			expect(result.order.subtotal).toBe(5998);
			expect(result.order.total).toBe(5998);
			expect(result.discountApplied).toBe(false);
		});

		it('should clear cart after checkout', () => {
			orderService.checkout(cartId);

			expect(cartService.getCart(cartId)).toBeNull();
		});

		it('should increment order counter', () => {
			const initialCount = store.orderCounter;
			orderService.checkout(cartId);

			expect(store.orderCounter).toBe(initialCount + 1);
		});

		it('should throw error for non-existent cart', () => {
			expect(() => orderService.checkout('non-existent')).toThrow(
				'CART_NOT_FOUND',
			);
		});

		it('should throw error for empty cart', () => {
			cartService.clearCart(cartId);
			const emptyCartId = 'empty-cart';
			cartService.getOrCreateCart(emptyCartId);

			expect(() => orderService.checkout(emptyCartId)).toThrow('CART_EMPTY');
		});
	});

	describe('checkout with discount', () => {
		it('should apply valid discount code', () => {
			const discount = discountService.generateCode(10);
			const result = orderService.checkout(cartId, discount.code);

			expect(result.discountApplied).toBe(true);
			expect(result.order.discountCode).toBe(discount.code);
			expect(result.order.discountAmount).toBe(599); // 10% of 5998
			expect(result.order.total).toBe(5399);
		});

		it('should throw error for invalid discount code', () => {
			expect(() => orderService.checkout(cartId, 'INVALID')).toThrow(
				'INVALID_DISCOUNT_CODE',
			);
		});

		it('should throw error for already used discount code', () => {
			const discount = discountService.generateCode(10);
			discountService.markAsUsed(discount.code, 'order_123');

			expect(() => orderService.checkout(cartId, discount.code)).toThrow(
				'INVALID_DISCOUNT_CODE',
			);
		});

		it('should mark discount code as used after checkout', () => {
			const discount = discountService.generateCode(10);
			const result = orderService.checkout(cartId, discount.code);

			const usedDiscount = store.discountCodes.get(discount.code);
			expect(usedDiscount?.isUsed).toBe(true);
			expect(usedDiscount?.usedByOrderId).toBe(result.order.id);
		});
	});

	describe('nth order discount generation', () => {
		it('should generate discount code on nth order', () => {
			// Simulate n-1 orders
			for (let i = 1; i < config.nthOrderForDiscount; i++) {
				cartService.addItem(`cart-${i}`, 'prod_1', 1);
				orderService.checkout(`cart-${i}`);
			}

			// The nth order should generate a discount
			cartService.addItem('nth-cart', 'prod_1', 1);
			const result = orderService.checkout('nth-cart');

			expect(result.newDiscountCode).not.toBeNull();
			expect(store.discountCodes.has(result.newDiscountCode!)).toBe(true);
		});

		it('should not generate discount code for non-nth order', () => {
			const result = orderService.checkout(cartId);

			expect(result.newDiscountCode).toBeNull();
		});
	});
});
