import { adminService } from '../../services/admin.service';
import { orderService } from '../../services/order.service';
import { cartService } from '../../services/cart.service';
import { discountService } from '../../services/discount.service';
import { store } from '../../store';
import { config } from '../../config';

describe('AdminService', () => {
	beforeEach(() => {
		store.reset();
	});

	describe('getStats', () => {
		it('should return empty stats initially', () => {
			const stats = adminService.getStats();

			expect(stats.totalItemsPurchased).toBe(0);
			expect(stats.totalPurchaseAmount).toBe(0);
			expect(stats.totalOrders).toBe(0);
			expect(stats.discountCodes).toHaveLength(0);
			expect(stats.totalDiscountAmount).toBe(0);
		});

		it('should return correct stats after orders', () => {
			// Verify clean state
			expect(store.orders.size).toBe(0);

			// Place first order
			cartService.addItem('cart-1', 'prod_1', 2); // 2999 * 2 = 5998
			const result1 = orderService.checkout('cart-1');
			expect(result1.order.items[0].quantity).toBe(2);
			expect(store.orders.size).toBe(1);

			// Place second order
			cartService.addItem('cart-2', 'prod_2', 1); // 5999
			const result2 = orderService.checkout('cart-2');
			expect(result2.order.items[0].quantity).toBe(1);
			expect(store.orders.size).toBe(2);

			const stats = adminService.getStats();

			expect(stats.totalOrders).toBe(2);
			expect(stats.totalItemsPurchased).toBe(3);
			expect(stats.totalPurchaseAmount).toBe(11997);
		});

		it('should track discount codes and amounts', () => {
			const discount = discountService.generateCode(10);

			// Use discount code
			cartService.addItem('cart-1', 'prod_1', 1); // 2999
			orderService.checkout('cart-1', discount.code);

			const stats = adminService.getStats();

			expect(stats.discountCodes).toHaveLength(1);
			expect(stats.totalDiscountAmount).toBe(299); // 10% of 2999
		});
	});

	describe('generateDiscountCode', () => {
		it('should not generate code when no orders', () => {
			const result = adminService.generateDiscountCode();

			expect(result.success).toBe(false);
			expect(result.message).toContain('Cannot generate');
		});

		it('should not generate code before nth order', () => {
			// Place some orders but not enough
			for (let i = 0; i < config.nthOrderForDiscount - 1; i++) {
				cartService.addItem(`cart-${i}`, 'prod_1', 1);
				orderService.checkout(`cart-${i}`);
			}

			const result = adminService.generateDiscountCode();

			expect(result.success).toBe(false);
		});

		it('should report already generated when checkout auto-generated', () => {
			// Place n orders - the nth checkout auto-generates a code
			for (let i = 0; i < config.nthOrderForDiscount; i++) {
				cartService.addItem(`cart-${i}`, 'prod_1', 1);
				const result = orderService.checkout(`cart-${i}`);

				// The nth order should auto-generate
				if (i === config.nthOrderForDiscount - 1) {
					expect(result.newDiscountCode).not.toBeNull();
				}
			}

			// Admin API should report already generated
			const result = adminService.generateDiscountCode();

			expect(result.success).toBe(false);
			expect(result.message).toContain('already generated');
		});

		it('should track auto-generated codes in stats', () => {
			// Place n orders to trigger auto-generation
			for (let i = 0; i < config.nthOrderForDiscount; i++) {
				cartService.addItem(`cart-${i}`, 'prod_1', 1);
				orderService.checkout(`cart-${i}`);
			}

			const stats = adminService.getStats();

			expect(stats.discountCodes).toHaveLength(1);
			expect(stats.discountCodes[0].generatedForOrderNumber).toBe(
				config.nthOrderForDiscount,
			);
		});
	});
});
