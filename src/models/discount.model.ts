export interface DiscountCode {
	code: string;
	percentage: number;
	isUsed: boolean;
	usedByOrderId?: string;
	generatedForOrderNumber: number;
	createdAt: Date;
	usedAt?: Date;
}
