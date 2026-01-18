import { discountService } from '../../services/discount.service';
import { store } from '../../store';
import { config } from '../../config';

describe('DiscountService', () => {
	describe('isNthOrder', () => {
		it('should return true for nth order', () => {
			expect(discountService.isNthOrder(config.nthOrderForDiscount)).toBe(true);
			expect(discountService.isNthOrder(config.nthOrderForDiscount * 2)).toBe(
				true,
			);
		});

		it('should return false for non-nth order', () => {
			expect(discountService.isNthOrder(1)).toBe(false);
			expect(discountService.isNthOrder(config.nthOrderForDiscount - 1)).toBe(
				false,
			);
		});
	});

	describe('generateCode', () => {
		it('should generate and store a discount code', () => {
			const code = discountService.generateCode(10);

			expect(code.code).toBeDefined();
			expect(code.percentage).toBe(config.discountPercentage);
			expect(code.isUsed).toBe(false);
			expect(code.generatedForOrderNumber).toBe(10);
			expect(store.discountCodes.has(code.code)).toBe(true);
		});
	});

	describe('validateCode', () => {
		it('should return valid for unused code', () => {
			const code = discountService.generateCode(10);
			const result = discountService.validateCode(code.code);

			expect(result.valid).toBe(true);
			expect(result.discount).toBeDefined();
		});

		it('should return invalid for non-existent code', () => {
			const result = discountService.validateCode('INVALID_CODE');

			expect(result.valid).toBe(false);
			expect(result.reason).toBe('Discount code not found');
		});

		it('should return invalid for already used code', () => {
			const code = discountService.generateCode(10);
			discountService.markAsUsed(code.code, 'order_123');

			const result = discountService.validateCode(code.code);

			expect(result.valid).toBe(false);
			expect(result.reason).toBe('Discount code has already been used');
		});
	});

	describe('markAsUsed', () => {
		it('should mark code as used with order id', () => {
			const code = discountService.generateCode(10);
			discountService.markAsUsed(code.code, 'order_123');

			const storedCode = store.discountCodes.get(code.code);
			expect(storedCode?.isUsed).toBe(true);
			expect(storedCode?.usedByOrderId).toBe('order_123');
			expect(storedCode?.usedAt).toBeDefined();
		});
	});

	describe('calculateDiscount', () => {
		it('should calculate correct discount amount', () => {
			expect(discountService.calculateDiscount(1000, 10)).toBe(100);
			expect(discountService.calculateDiscount(2999, 10)).toBe(299);
		});

		it('should floor the discount amount', () => {
			expect(discountService.calculateDiscount(1001, 10)).toBe(100);
		});
	});
});
