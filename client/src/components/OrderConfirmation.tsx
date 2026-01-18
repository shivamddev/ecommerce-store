import type { Order } from '../types';

interface Props {
	order: Order;
	onContinue: () => void;
}

export function OrderConfirmation({ order, onContinue }: Props) {
	return (
		<div className="order-confirmation">
			<h2>Order Confirmed!</h2>
			<p className="order-number">Order #{order.orderNumber}</p>

			<div className="order-details">
				<h3>Items</h3>
				{order.items.map((item) => (
					<div key={item.productId} className="order-item">
						<span>
							{item.productName} x {item.quantity}
						</span>
						<span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
					</div>
				))}

				<div className="order-totals">
					<div className="total-row">
						<span>Subtotal:</span>
						<span>{order.subtotalFormatted}</span>
					</div>
					{order.discountApplied && (
						<div className="total-row discount">
							<span>Discount ({order.discountCode}):</span>
							<span>-{order.discountAmountFormatted}</span>
						</div>
					)}
					<div className="total-row final">
						<strong>Total:</strong>
						<strong>{order.totalFormatted}</strong>
					</div>
				</div>
			</div>

			{order.newDiscountCode && (
				<div className="new-discount">
					<h3>Congratulations!</h3>
					<p>You've earned a 10% discount code for your next order:</p>
					<code>{order.newDiscountCode}</code>
				</div>
			)}

			<button onClick={onContinue}>Continue Shopping</button>
		</div>
	);
}
