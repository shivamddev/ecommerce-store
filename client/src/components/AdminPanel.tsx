import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { StoreStats } from '../types';

interface Props {
	onClose: () => void;
}

export function AdminPanel({ onClose }: Props) {
	const [stats, setStats] = useState<StoreStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [generating, setGenerating] = useState(false);
	const [resetting, setResetting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const fetchStats = async () => {
		const res = await api.getStats();
		if (res.success && res.data) {
			setStats(res.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchStats();
	}, []);

	const handleGenerateDiscount = async () => {
		setGenerating(true);
		setMessage(null);

		const res = await api.generateDiscount();
		setGenerating(false);

		if (res.success && res.data) {
			setMessage(`Generated code: ${res.data.code}`);
			fetchStats();
		} else {
			setMessage(res.message || 'Cannot generate discount code');
		}
	};

	const handleReset = async () => {
		if (!confirm('Are you sure you want to reset the store? This will clear all orders, carts, and discount codes.')) {
			return;
		}
		setResetting(true);
		setMessage(null);

		const res = await api.resetStore();
		setResetting(false);

		if (res.success) {
			setMessage('Store has been reset');
			fetchStats();
		} else {
			setMessage('Failed to reset store');
		}
	};

	if (loading) return <div>Loading stats...</div>;
	if (!stats) return <div>Failed to load stats</div>;

	return (
		<div className="admin-panel">
			<div className="admin-header">
				<h2>Admin Panel</h2>
				<div className="admin-actions">
					<button
						className="reset-btn"
						onClick={handleReset}
						disabled={resetting}
					>
						{resetting ? 'Resetting...' : 'Reset Store'}
					</button>
					<button onClick={onClose}>Close</button>
				</div>
			</div>

			<div className="stats-grid">
				<div className="stat-card">
					<h3>Total Orders</h3>
					<p className="stat-value">{stats.totalOrders}</p>
				</div>
				<div className="stat-card">
					<h3>Items Purchased</h3>
					<p className="stat-value">{stats.totalItemsPurchased}</p>
				</div>
				<div className="stat-card">
					<h3>Total Revenue</h3>
					<p className="stat-value">{stats.totalPurchaseAmountFormatted}</p>
				</div>
				<div className="stat-card">
					<h3>Total Discounts Given</h3>
					<p className="stat-value">{stats.totalDiscountAmountFormatted}</p>
				</div>
			</div>

			<div className="discount-codes-section">
				<h3>Discount Codes</h3>
				<p className="config-info">
					Discount generated every {stats.nthOrderConfig} orders
				</p>

				{stats.discountCodes.length === 0 ? (
					<p>No discount codes generated yet</p>
				) : (
					<table className="discount-table">
						<thead>
							<tr>
								<th>Code</th>
								<th>For Order #</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{stats.discountCodes.map((dc) => (
								<tr key={dc.code}>
									<td>
										<code>{dc.code}</code>
									</td>
									<td>{dc.generatedForOrderNumber}</td>
									<td>
										{dc.isUsed ? (
											<span className="used">Used</span>
										) : (
											<span className="available">Available</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				<div className="generate-section">
					<button onClick={handleGenerateDiscount} disabled={generating}>
						{generating ? 'Generating...' : 'Generate Discount Code'}
					</button>
					{message && <p className="generate-message">{message}</p>}
				</div>
			</div>
		</div>
	);
}
