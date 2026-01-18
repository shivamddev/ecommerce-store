import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middleware
const allowedOrigins = [
	'https://ecommerce-store-weld-xi.vercel.app',
	'http://localhost:5173',
];

app.use(
	cors({
		origin(origin, cb) {
			if (!origin) return cb(null, true); // curl/postman
			if (allowedOrigins.includes(origin)) return cb(null, true);
			return cb(new Error(`CORS blocked: ${origin}`));
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
