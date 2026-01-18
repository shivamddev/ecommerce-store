export interface CartItem {
	productId: string;
	productName: string;
	price: number;
	quantity: number;
}

export interface Cart {
	id: string;
	items: CartItem[];
	createdAt: Date;
	updatedAt: Date;
}
