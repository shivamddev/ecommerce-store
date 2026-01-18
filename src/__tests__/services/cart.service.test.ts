import { cartService } from '../../services/cart.service';

describe('CartService', () => {
	const cartId = 'test-cart';

	describe('getOrCreateCart', () => {
		it('should create new cart if not exists', () => {
			const cart = cartService.getOrCreateCart(cartId);

			expect(cart.id).toBe(cartId);
			expect(cart.items).toHaveLength(0);
		});

		it('should return existing cart', () => {
			const cart1 = cartService.getOrCreateCart(cartId);
			cartService.addItem(cartId, 'prod_1', 1);
			const cart2 = cartService.getOrCreateCart(cartId);

			expect(cart2.items).toHaveLength(1);
			expect(cart1).toBe(cart2);
		});
	});

	describe('addItem', () => {
		it('should add item to cart', () => {
			const cart = cartService.addItem(cartId, 'prod_1', 2);

			expect(cart.items).toHaveLength(1);
			expect(cart.items[0].productId).toBe('prod_1');
			expect(cart.items[0].quantity).toBe(2);
			expect(cart.items[0].price).toBe(2999);
		});

		it('should increment quantity for existing item', () => {
			cartService.addItem(cartId, 'prod_1', 2);
			const cart = cartService.addItem(cartId, 'prod_1', 3);

			expect(cart.items).toHaveLength(1);
			expect(cart.items[0].quantity).toBe(5);
		});

		it('should throw error for invalid product', () => {
			expect(() => cartService.addItem(cartId, 'invalid', 1)).toThrow(
				'PRODUCT_NOT_FOUND',
			);
		});

		it('should throw error for invalid quantity', () => {
			expect(() => cartService.addItem(cartId, 'prod_1', 0)).toThrow(
				'INVALID_QUANTITY',
			);
			expect(() => cartService.addItem(cartId, 'prod_1', -1)).toThrow(
				'INVALID_QUANTITY',
			);
		});
	});

	describe('updateItemQuantity', () => {
		beforeEach(() => {
			cartService.addItem(cartId, 'prod_1', 2);
		});

		it('should update item quantity', () => {
			const cart = cartService.updateItemQuantity(cartId, 'prod_1', 5);

			expect(cart.items[0].quantity).toBe(5);
		});

		it('should remove item when quantity is 0', () => {
			const cart = cartService.updateItemQuantity(cartId, 'prod_1', 0);

			expect(cart.items).toHaveLength(0);
		});

		it('should throw error for non-existent cart', () => {
			expect(() =>
				cartService.updateItemQuantity('non-existent', 'prod_1', 1),
			).toThrow('CART_NOT_FOUND');
		});

		it('should throw error for non-existent item', () => {
			expect(() =>
				cartService.updateItemQuantity(cartId, 'prod_999', 1),
			).toThrow('ITEM_NOT_FOUND');
		});
	});

	describe('removeItem', () => {
		beforeEach(() => {
			cartService.addItem(cartId, 'prod_1', 2);
		});

		it('should remove item from cart', () => {
			const cart = cartService.removeItem(cartId, 'prod_1');

			expect(cart.items).toHaveLength(0);
		});

		it('should throw error for non-existent item', () => {
			expect(() => cartService.removeItem(cartId, 'prod_999')).toThrow(
				'ITEM_NOT_FOUND',
			);
		});
	});

	describe('calculateSubtotal', () => {
		it('should calculate correct subtotal', () => {
			cartService.addItem(cartId, 'prod_1', 2); // 2999 * 2 = 5998
			cartService.addItem(cartId, 'prod_2', 1); // 5999 * 1 = 5999
			const cart = cartService.getCart(cartId)!;

			expect(cartService.calculateSubtotal(cart)).toBe(11997);
		});
	});
});
