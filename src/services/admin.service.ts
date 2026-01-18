import { store } from '../store';
import { discountService } from './discount.service';
import { orderService } from './order.service';
import { config } from '../config';
import { formatPrice } from '../utils/response.util';

export interface StoreStats {
	totalItemsPurchased: number;
	totalPurchaseAmount: number;
	totalPurchaseAmountFormatted: string;
	totalOrders: number;
	discountCodes: Array<{
		code: string;
		percentage: number;
		isUsed: boolean;
		usedByOrderId?: string;
		generatedForOrderNumber: number;
		createdAt: Date;
		usedAt?: Date;
	}>;
	totalDiscountAmount: number;
	totalDiscountAmountFormatted: string;
	nthOrderConfig: number;
}

export class AdminService {
	getStats(): StoreStats {
		const orders = orderService.getAllOrders();
		const discountCodes = discountService.getAllCodes();

		const totalItemsPurchased = orders.reduce(
			(sum, order) =>
				sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
			0,
		);

		const totalPurchaseAmount = orders.reduce(
			(sum, order) => sum + order.total,
			0,
		);

		const totalDiscountAmount = orders.reduce(
			(sum, order) => sum + order.discountAmount,
			0,
		);

		return {
			totalItemsPurchased,
			totalPurchaseAmount,
			totalPurchaseAmountFormatted: formatPrice(totalPurchaseAmount),
			totalOrders: orders.length,
			discountCodes: discountCodes.map((dc) => ({
				code: dc.code,
				percentage: dc.percentage,
				isUsed: dc.isUsed,
				usedByOrderId: dc.usedByOrderId,
				generatedForOrderNumber: dc.generatedForOrderNumber,
				createdAt: dc.createdAt,
				usedAt: dc.usedAt,
			})),
			totalDiscountAmount,
			totalDiscountAmountFormatted: formatPrice(totalDiscountAmount),
			nthOrderConfig: config.nthOrderForDiscount,
		};
	}

	generateDiscountCode(): { success: boolean; code?: string; message: string } {
		const { canGenerate, currentCount, nextEligible } =
			discountService.canGenerateDiscount();

		if (!canGenerate) {
			return {
				success: false,
				message: `Cannot generate discount code. Current order count: ${currentCount}, next eligible: ${nextEligible}`,
			};
		}

		// Check if a discount code was already generated for this nth order
		const existingCodes = discountService.getAllCodes();
		const alreadyGenerated = existingCodes.some(
			(dc) => dc.generatedForOrderNumber === currentCount && !dc.isUsed,
		);

		if (alreadyGenerated) {
			return {
				success: false,
				message: `Discount code for order #${currentCount} was already generated`,
			};
		}

		const discountCode = discountService.generateCode(currentCount);
		return {
			success: true,
			code: discountCode.code,
			message: `Discount code generated for order #${currentCount}`,
		};
	}
}

export const adminService = new AdminService();
