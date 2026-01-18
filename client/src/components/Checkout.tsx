import { useState } from 'react';
import { api } from '../api/client';
import type { Cart, Order } from '../types';

interface Props {
	cart: Cart;
	cartId: string;
	onComplete: (order: Order) => void;
	onCancel: () => void;
}

export function Checkout({ cart, cartId, onComplete, onCancel }: Props) {
	const [discountCode, setDiscountCode] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleCheckout = async () => {
		setLoading(true);
		setError(null);

		const res = await api.checkout(
			cartId,
			discountCode.trim() || undefined
		);

		setLoading(false);

		if (res.success && res.data) {
			onComplete(res.data);
		} else {
			setError(res.message || 'Checkout failed');
		}
	};

	return (
		<div className="checkout">
			<h2>Checkout</h2>

			<div className="order-summary">
				<h3>Order Summary</h3>
				{cart.items.map((item) => (
					<div key={item.productId} className="summary-item">
						<span>
							{item.productName} x {item.quantity}
						</span>
						<span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
					</div>
				))}
				<div className="summary-total">
					<strong>Subtotal:</strong>
					<strong>{cart.subtotalFormatted}</strong>
				</div>
			</div>

			<div className="discount-section">
				<label htmlFor="discount">Discount Code (optional)</label>
				<input
					id="discount"
					type="text"
					value={discountCode}
					onChange={(e) => setDiscountCode(e.target.value)}
					placeholder="Enter discount code"
				/>
			</div>

			{error && <p className="error">{error}</p>}

			<div className="checkout-actions">
				<button onClick={onCancel} disabled={loading}>
					Back to Cart
				</button>
				<button
					className="place-order"
					onClick={handleCheckout}
					disabled={loading}
				>
					{loading ? 'Processing...' : 'Place Order'}
				</button>
			</div>
		</div>
	);
}
