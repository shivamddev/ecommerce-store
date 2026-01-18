import { store } from '../store';
import { DiscountCode } from '../models';
import { config } from '../config';
import { generateDiscountCode } from '../utils/discount-code.util';

export interface ValidationResult {
	valid: boolean;
	discount?: DiscountCode;
	reason?: string;
}

export class DiscountService {
	isNthOrder(orderNumber: number): boolean {
		return orderNumber % config.nthOrderForDiscount === 0;
	}

	generateCode(orderNumber: number): DiscountCode {
		const code = generateDiscountCode();
		const discountCode: DiscountCode = {
			code,
			percentage: config.discountPercentage,
			isUsed: false,
			generatedForOrderNumber: orderNumber,
			createdAt: new Date(),
		};
		store.discountCodes.set(code, discountCode);
		return discountCode;
	}

	validateCode(code: string): ValidationResult {
		const discount = store.discountCodes.get(code);
		if (!discount) {
			return { valid: false, reason: 'Discount code not found' };
		}
		if (discount.isUsed) {
			return { valid: false, reason: 'Discount code has already been used' };
		}
		return { valid: true, discount };
	}

	markAsUsed(code: string, orderId: string): void {
		const discount = store.discountCodes.get(code);
		if (discount) {
			discount.isUsed = true;
			discount.usedByOrderId = orderId;
			discount.usedAt = new Date();
		}
	}

	calculateDiscount(subtotal: number, percentage: number): number {
		return Math.floor((subtotal * percentage) / 100);
	}

	getAllCodes(): DiscountCode[] {
		return Array.from(store.discountCodes.values());
	}

	canGenerateDiscount(): {
		canGenerate: boolean;
		currentCount: number;
		nextEligible: number;
	} {
		const currentCount = store.orderCounter;
		const n = config.nthOrderForDiscount;
		const nextEligible = Math.ceil((currentCount + 1) / n) * n;
		const canGenerate = currentCount > 0 && currentCount % n === 0;

		return { canGenerate, currentCount, nextEligible };
	}
}

export const discountService = new DiscountService();
