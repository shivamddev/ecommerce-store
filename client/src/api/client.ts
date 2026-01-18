import type { ApiResponse, Cart, Order, Product, StoreStats } from '../types';

// const API_BASE = 'http://localhost:3000/api';
const API_BASE = 'https://ecommerce-store-api-six.vercel.app/api';

async function request<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<ApiResponse<T>> {
	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers,
		},
	});
	return response.json();
}

export const api = {
	// Products
	getProducts: () => request<Product[]>('/products'),

	// Cart
	getCart: (cartId: string) => request<Cart>(`/carts/${cartId}`),

	addToCart: (cartId: string, productId: string, quantity: number) =>
		request<Cart>(`/carts/${cartId}/items`, {
			method: 'POST',
			body: JSON.stringify({ productId, quantity }),
		}),

	updateCartItem: (cartId: string, productId: string, quantity: number) =>
		request<Cart>(`/carts/${cartId}/items/${productId}`, {
			method: 'PUT',
			body: JSON.stringify({ quantity }),
		}),

	removeFromCart: (cartId: string, productId: string) =>
		request<Cart>(`/carts/${cartId}/items/${productId}`, {
			method: 'DELETE',
		}),

	// Checkout
	checkout: (cartId: string, discountCode?: string) =>
		request<Order>('/checkout', {
			method: 'POST',
			body: JSON.stringify({ cartId, discountCode }),
		}),

	// Admin
	getStats: () => request<StoreStats>('/admin/stats'),

	generateDiscount: () =>
		request<{ code: string; percentage: number }>('/admin/discount/generate', {
			method: 'POST',
		}),

	resetStore: () =>
		request<{ reset: boolean }>('/admin/reset', {
			method: 'POST',
		}),
};
