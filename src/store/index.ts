import { Cart, Product } from '../models';

class Store {
	private static instance: Store;

	products: Map<string, Product> = new Map();
	carts: Map<string, Cart> = new Map();

	private constructor() {
		this.seedProducts();
	}

	public static getInstance(): Store {
		if (!Store.instance) {
			console.log('New Store instance created!');
			Store.instance = new Store();
		}
		return Store.instance;
	}

	private seedProducts(): void {
		const products: Product[] = [
			{
				id: 'prod_1',
				name: 'T-Shirt',
				price: 2999,
				description: 'Cotton T-Shirt',
			},
			{ id: 'prod_2', name: 'Jeans', price: 5999, description: 'Denim Jeans' },
			{
				id: 'prod_3',
				name: 'Sneakers',
				price: 8999,
				description: 'Running Sneakers',
			},
			{ id: 'prod_4', name: 'Hoodie', price: 4999, description: 'Warm Hoodie' },
			{ id: 'prod_5', name: 'Cap', price: 1499, description: 'Baseball Cap' },
		];
		products.forEach((p) => this.products.set(p.id, p));
	}
}

export const store = Store.getInstance();
