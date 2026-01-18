import { store } from '../store';
import { Cart, CartItem } from '../models/cart.model';

export class CartService {
	getCart(cartId: string): Cart | null {
		return store.carts.get(cartId) || null;
	}

	getOrCreateCart(cartId: string): Cart {
		let cart = store.carts.get(cartId);
		if (!cart) {
			cart = {
				id: cartId,
				items: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			store.carts.set(cartId, cart);
		}
		return cart;
	}

	addItem(cartId: string, productId: string, quantity: number): Cart {
		const product = store.products.get(productId);
		if (!product) {
			throw new Error('PRODUCT_NOT_FOUND');
		}

		if (quantity <= 0) {
			throw new Error('INVALID_QUANTITY');
		}

		const cart = this.getOrCreateCart(cartId);
		const existingItem = cart.items.find(
			(item) => item.productId === productId,
		);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			const newItem: CartItem = {
				productId: product.id,
				productName: product.name,
				price: product.price,
				quantity,
			};
			cart.items.push(newItem);
		}

		cart.updatedAt = new Date();
		return cart;
	}

	updateItemQuantity(
		cartId: string,
		productId: string,
		quantity: number,
	): Cart {
		const cart = store.carts.get(cartId);
		if (!cart) {
			throw new Error('CART_NOT_FOUND');
		}

		if (quantity < 0) {
			throw new Error('INVALID_QUANTITY');
		}

		const itemIndex = cart.items.findIndex(
			(item) => item.productId === productId,
		);
		if (itemIndex === -1) {
			throw new Error('ITEM_NOT_FOUND');
		}

		if (quantity === 0) {
			cart.items.splice(itemIndex, 1);
		} else {
			cart.items[itemIndex].quantity = quantity;
		}

		cart.updatedAt = new Date();
		return cart;
	}

	removeItem(cartId: string, productId: string): Cart {
		const cart = store.carts.get(cartId);
		if (!cart) {
			throw new Error('CART_NOT_FOUND');
		}

		const itemIndex = cart.items.findIndex(
			(item) => item.productId === productId,
		);
		if (itemIndex === -1) {
			throw new Error('ITEM_NOT_FOUND');
		}

		cart.items.splice(itemIndex, 1);
		cart.updatedAt = new Date();
		return cart;
	}

	clearCart(cartId: string): void {
		store.carts.delete(cartId);
	}

	calculateSubtotal(cart: Cart): number {
		return cart.items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
	}

	getItemCount(cart: Cart): number {
		return cart.items.reduce((sum, item) => sum + item.quantity, 0);
	}
}

export const cartService = new CartService();
