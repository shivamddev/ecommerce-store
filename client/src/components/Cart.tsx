import { api } from '../api/client';
import type { Cart as CartType } from '../types';

interface Props {
	cart: CartType | null;
	onUpdate: () => void;
	onCheckout: () => void;
	cartId: string;
}

export function Cart({ cart, onUpdate, onCheckout, cartId }: Props) {
	const handleQuantityChange = async (productId: string, quantity: number) => {
		if (quantity <= 0) {
			await api.removeFromCart(cartId, productId);
		} else {
			await api.updateCartItem(cartId, productId, quantity);
		}
		onUpdate();
	};

	const handleRemove = async (productId: string) => {
		await api.removeFromCart(cartId, productId);
		onUpdate();
	};

	if (!cart || cart.items.length === 0) {
		return (
			<div className="cart">
				<h2>Shopping Cart</h2>
				<p className="empty-cart">Your cart is empty</p>
			</div>
		);
	}

	return (
		<div className="cart">
			<h2>Shopping Cart ({cart.itemCount} items)</h2>
			<div className="cart-items">
				{cart.items.map((item) => (
					<div key={item.productId} className="cart-item">
						<div className="item-info">
							<span className="item-name">{item.productName}</span>
							<span className="item-price">
								${(item.price / 100).toFixed(2)} each
							</span>
						</div>
						<div className="item-actions">
							<button
								onClick={() =>
									handleQuantityChange(item.productId, item.quantity - 1)
								}
							>
								-
							</button>
							<span className="quantity">{item.quantity}</span>
							<button
								onClick={() =>
									handleQuantityChange(item.productId, item.quantity + 1)
								}
							>
								+
							</button>
							<button
								className="remove"
								onClick={() => handleRemove(item.productId)}
							>
								Remove
							</button>
						</div>
					</div>
				))}
			</div>
			<div className="cart-total">
				<strong>Subtotal: {cart.subtotalFormatted}</strong>
			</div>
			<button className="checkout-btn" onClick={onCheckout}>
				Proceed to Checkout
			</button>
		</div>
	);
}
