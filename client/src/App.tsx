import { useCallback, useEffect, useState } from 'react';
import { api } from './api/client';
import { AdminPanel } from './components/AdminPanel';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { ProductList } from './components/ProductList';
import type { Cart as CartType, Order } from './types';
import './App.css';

type View = 'shop' | 'checkout' | 'confirmation' | 'admin';

const CART_ID = 'user-cart-1';

function App() {
	const [view, setView] = useState<View>('shop');
	const [cart, setCart] = useState<CartType | null>(null);
	const [order, setOrder] = useState<Order | null>(null);

	const fetchCart = useCallback(async () => {
		const res = await api.getCart(CART_ID);
		if (res.success && res.data) {
			setCart(res.data);
		}
	}, []);

	useEffect(() => {
		fetchCart();
	}, [fetchCart]);

	const handleAddToCart = async (productId: string, quantity: number) => {
		await api.addToCart(CART_ID, productId, quantity);
		fetchCart();
	};

	const handleCheckoutComplete = (completedOrder: Order) => {
		setOrder(completedOrder);
		setCart(null);
		setView('confirmation');
	};

	const handleContinueShopping = () => {
		setOrder(null);
		setView('shop');
		fetchCart();
	};

	return (
		<div className="app">
			<header>
				<h1>E-Commerce Store</h1>
				<nav>
					<button
						className={view === 'shop' ? 'active' : ''}
						onClick={() => setView('shop')}
					>
						Shop
					</button>
					<button
						className={view === 'admin' ? 'active' : ''}
						onClick={() => setView('admin')}
					>
						Admin
					</button>
				</nav>
			</header>

			<main>
				{view === 'shop' && (
					<div className="shop-layout">
						<ProductList onAddToCart={handleAddToCart} />
						<Cart
							cart={cart}
							cartId={CART_ID}
							onUpdate={fetchCart}
							onCheckout={() => setView('checkout')}
						/>
					</div>
				)}

				{view === 'checkout' && cart && (
					<Checkout
						cart={cart}
						cartId={CART_ID}
						onComplete={handleCheckoutComplete}
						onCancel={() => setView('shop')}
					/>
				)}

				{view === 'confirmation' && order && (
					<OrderConfirmation
						order={order}
						onContinue={handleContinueShopping}
					/>
				)}

				{view === 'admin' && <AdminPanel onClose={() => setView('shop')} />}
			</main>
		</div>
	);
}

export default App;
