import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middleware
app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'https://ecommerce-store-weld-xi.vercel.app',
		],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type'],
	})
);
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

export default app;
