# Challenge 1 Frontend - Order Pricing Engine

React TypeScript frontend for the Order Pricing & Promotion Engine.

This README focuses on the frontend package. For the complete fullstack submission overview, see the repository root `README.md`.

## Tech Stack

- React
- TypeScript
- Vite
- Material UI
- Redux Toolkit
- React Redux

## Features

- Order Builder with dynamic line items
- SKU dropdown populated from backend `GET /products`
- Automatic unit price fill after SKU selection
- Customer type selector for `NORMAL` and `VIP`
- Coupon input with apply button
- Coupon chips loaded from backend `GET /coupons`
- Coupon details dialog opened by an icon button
- Pricing Summary with loading, success, error, subtotal, discounts, and final price
- Promotions tab loaded from backend `GET /promotions`
- Client-side validation for SKU, price, and quantity
- Responsive layout for desktop and tablet

## Frontend Architecture

```text
src/
  api/
    pricingApi.ts       Public API facade (calculate, catalog fetches)
    config.ts           Fetch helpers, env flags, mock toggle
    mappers.ts          Backend DTO → frontend type mapping
    mock/
      catalog.ts        Mock products, coupons, promotions
      pricingEngine.ts  Mock pricing for standalone review
  components/           Reusable UI components
  components/order/     Order builder components
  components/promotions Promotion display components
  features/order/       Redux slice, useOrderForm hook, validation
  pages/                Page-level composition
  store/                Redux store setup
  types/                Shared TypeScript contracts (order, common)
  utils/                Formatting and order total helpers
```

## Architecture Decisions

- **Layered API boundary:** `pricingApi.ts` is the facade; HTTP, mappers, and mock data live in dedicated modules under `src/api/`.
- **Redux for async state:** pricing, products, coupons, and promotions each track loading, success, and error states.
- **Component decomposition:** order metrics, coupon field, line item editor, customer selector, pricing summary, and promotion cards are separated.
- **Backend-driven options:** SKU and coupon choices come from backend data instead of hardcoded UI lists.
- **Vite proxy:** the frontend calls `/api/*`; Vite forwards to the backend at `http://localhost:8080`.
- **Mock fallback:** mock mode still exists for standalone review, but normal challenge flow uses the backend.

## SOLID and UI Design

- **Single Responsibility:** validation, API calls, Redux state, and UI rendering are separated.
- **Open/Closed:** new coupon or promotion display data can be rendered without rewriting the page layout.
- **Dependency boundary:** UI components receive data through props and do not call `fetch` directly.
- **Reusable components:** shared card, order editor, and summary components avoid monolithic page code.

## API Integration

Configured through `.env.local`:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=/api
```

Vite proxy mapping:

```text
/api/orders/calculate -> http://localhost:8080/orders/calculate
/api/products -> http://localhost:8080/products
/api/coupons -> http://localhost:8080/coupons
/api/promotions -> http://localhost:8080/promotions
```

## Main User Flow

1. App loads products, coupons, and promotions from the backend.
2. User selects SKU from a dropdown.
3. Unit price is filled from backend product data.
4. User selects customer type.
5. User applies or inspects a coupon.
6. User clicks Calculate Price.
7. UI shows loading state.
8. Backend returns subtotal, discount, final price, and applied discount breakdown.
9. Pricing Summary displays the result or a structured error message.

## How to Run

From repository root:

```bash
# Terminal 1 — database (first time)
cd backend/order_pricing_and_promotion_engine
./scripts/setup-local-db.sh

# Terminal 1 — backend
mvn spring-boot:run

# Terminal 2 — frontend
cd frontend
cp .env.example .env.local   # if not created yet
npm install
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Quality Checks

```bash
npm run build
npm run lint
npm run test
```

## Trade-offs

- MUI tabs are used instead of a full router because the exercise has two top-level screens.
- Mock API mode is kept for standalone frontend review, but the real backend remains the source of truth.
- Product price is displayed and submitted by the frontend for a simple stateless API contract. The backend should remain responsible for final validation in production.
- The coupon details dialog estimates coupon impact based on current subtotal; the backend still performs authoritative calculation.
- Mock pricing (`mock/pricingEngine.ts`) may differ slightly from backend pipeline stacking; use `VITE_USE_MOCK_API=false` when validating challenge totals.
