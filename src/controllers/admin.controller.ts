import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { config } from '../config';

export class AdminController {
	getStats(req: Request, res: Response): void {
		const stats = adminService.getStats();
		sendSuccess(res, stats);
	}

	generateDiscount(req: Request, res: Response): void {
		const result = adminService.generateDiscountCode();

		if (result.success) {
			sendSuccess(
				res,
				{
					code: result.code,
					percentage: config.discountPercentage,
				},
				result.message,
				201,
			);
		} else {
			sendError(res, 'CONDITIONS_NOT_MET', result.message);
		}
	}
}

export const adminController = new AdminController();
