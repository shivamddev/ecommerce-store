## Architecture

```
├── src/                    # Backend (Express + TypeScript)
│   ├── __tests__/          # Unit tests (Jest)
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── models/             # TypeScript interfaces
│   ├── routes/             # API route definitions
│   ├── store/              # In-memory data store (singleton)
│   ├── utils/              # Helpers (response formatting, etc.)
│   └── config/             # App configuration
│
│
├── client/                 # Frontend (React + Vite)
│   └── src/
│       ├── components/     # React components
│       ├── api/            # API client
│       └── types/          # TypeScript types
```

## Setup

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

# Run backend (port 3000)
npm run dev

# Run frontend (port 5173) - in separate terminal
cd client && npm run dev
```

## API Endpoints

| Method | Endpoint                              | Description                               |
| ------ | ------------------------------------- | ----------------------------------------- |
| GET    | `/api/products`                       | List all products                         |
| GET    | `/api/carts/:cartId`                  | Get cart                                  |
| POST   | `/api/carts/:cartId/items`            | Add item to cart                          |
| PUT    | `/api/carts/:cartId/items/:productId` | Update item quantity                      |
| DELETE | `/api/carts/:cartId/items/:productId` | Remove item                               |
| POST   | `/api/checkout`                       | Place order (with optional discount code) |
| GET    | `/api/admin/stats`                    | Get store statistics                      |
| POST   | `/api/admin/discount/generate`        | Generate discount code                    |
| POST   | `/api/admin/reset`                    | Reset store data                          |

## Discount Logic

- Every 10th order automatically generates a 10% discount code
- Discount codes are single-use
- Discount applies to entire order

## Tests

```bash
npm test
```

## Config

Edit `src/config/index.ts`:

- `nthOrderForDiscount`: Orders between discount codes (default: 10)
- `discountPercentage`: Discount amount (default: 10%)
