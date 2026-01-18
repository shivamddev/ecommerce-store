export interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
}

export interface CartItem {
	productId: string;
	productName: string;
	price: number;
	quantity: number;
}

export interface Cart {
	id: string;
	items: CartItem[];
	itemCount: number;
	subtotal: number;
	subtotalFormatted: string;
}

export interface Order {
	orderId: string;
	orderNumber: number;
	items: CartItem[];
	subtotal: number;
	subtotalFormatted: string;
	discountApplied: boolean;
	discountCode: string | null;
	discountAmount: number;
	discountAmountFormatted: string;
	total: number;
	totalFormatted: string;
	newDiscountCode: string | null;
}

export interface DiscountCode {
	code: string;
	percentage: number;
	isUsed: boolean;
	usedByOrderId?: string;
	generatedForOrderNumber: number;
}

export interface StoreStats {
	totalItemsPurchased: number;
	totalPurchaseAmount: number;
	totalPurchaseAmountFormatted: string;
	totalOrders: number;
	discountCodes: DiscountCode[];
	totalDiscountAmount: number;
	totalDiscountAmountFormatted: string;
	nthOrderConfig: number;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}
