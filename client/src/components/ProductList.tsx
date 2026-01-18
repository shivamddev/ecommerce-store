import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Product } from '../types';

interface Props {
	onAddToCart: (productId: string, quantity: number) => void;
}

export function ProductList({ onAddToCart }: Props) {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.getProducts().then((res) => {
			if (res.success && res.data) {
				setProducts(res.data);
			}
			setLoading(false);
		});
	}, []);

	if (loading) return <div>Loading products...</div>;

	return (
		<div className="product-list">
			<h2>Products</h2>
			<div className="products-grid">
				{products.map((product) => (
					<div key={product.id} className="product-card">
						<h3>{product.name}</h3>
						<p className="description">{product.description}</p>
						<p className="price">${(product.price / 100).toFixed(2)}</p>
						<button onClick={() => onAddToCart(product.id, 1)}>
							Add to Cart
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
