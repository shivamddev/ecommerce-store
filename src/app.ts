import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middleware
const allowedOrigins = [
	'https://ecommerce-store-api-six.vercel.app',
	'http://localhost:5173/',
];

app.use(
	cors({
		origin(origin, cb) {
			if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
			return cb(new Error('Not allowed by CORS'));
		},
		credentials: true,
	}),
);
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

export default app;
