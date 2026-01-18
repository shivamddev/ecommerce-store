import { CartItem } from './cart.model';

export interface Order {
	id: string;
	orderNumber: number;
	items: CartItem[];
	subtotal: number;
	discountCode?: string;
	discountAmount: number;
	total: number;
	createdAt: Date;
}
