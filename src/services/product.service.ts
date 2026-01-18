import { store } from '../store';
import { Product } from '../models';

export class ProductService {
	getAllProducts(): Product[] {
		return Array.from(store.products.values());
	}
}

export const productService = new ProductService();
