# Challenge 1 - Order Pricing & Promotion Engine

This repository contains a fullstack implementation for the Middle Fullstack Java Engineer coding exercise.

Chosen problem: **Challenge 1 - Order Pricing & Promotion Engine**.

The application lets a user build an order, select products, apply coupon codes, calculate the final price, and inspect configured promotions.

## Repository Structure

```text
challenge-01-fe-and-be/
  backend/
    order_pricing_and_promotion_engine/       Spring Boot backend
    order_pricing_promotion_engine_database.sql  DDL + seed (used by setup script)
  frontend/                                   React TypeScript frontend
  README.md                                   Fullstack submission overview
```

Package-level documentation:

- Backend details: `backend/order_pricing_and_promotion_engine/README.md`
- Frontend details: `frontend/README.md`

## Tech Stack

Backend:

- Java 17
- Spring Boot
- Spring Web MVC
- Spring Data JPA / Hibernate
- PostgreSQL
- MapStruct
- Lombok
- JUnit 5 / Mockito
- Maven

Frontend:

- React
- TypeScript
- Vite
- Material UI
- Redux Toolkit
- React Redux

## What Was Built

### Backend

- `POST /orders/calculate` calculates subtotal, discounts, final price, and applied discount breakdown.
- Order, promotion, coupon, and product APIs.
- Product catalog endpoint for the frontend SKU dropdown.
- Coupon endpoint for coupon presets and coupon explanation dialog.
- Structured JSON error responses.
- PostgreSQL-backed entities for products, orders, order items, promotions, and coupons.
- Local PostgreSQL via Docker script (`./scripts/setup-local-db.sh`);
- `CustomerType` enum (`NORMAL` / `VIP`) on calculate/create requests (case-insensitive JSON).
- Unit tests for pricing and promotion logic.

### Frontend

- Order Builder with dynamic line items.
- SKU dropdown populated from backend products.
- Customer type toggle for `NORMAL` / `VIP`.
- Coupon input, apply button, coupon preset chips, and coupon details dialog.
- Pricing Summary with loading, success, error, subtotal, discount breakdown, and final price.
- Promotions tab listing configured promotion rules.
- Client-side validation for SKU, price, and quantity.
- Responsive desktop/tablet layout.

## Architecture Decisions

- **Stateless API:** the calculate endpoint receives all required data in the request body. It works for both UI callers and service-to-service callers.
- **Layered backend:** controllers, services, repositories, mappers, DTOs, and entities are separated.
- **DTO boundary:** API responses do not expose JPA entities directly.
- **Promotion pipeline:** pricing logic is isolated from HTTP and persistence code.
- **Backend-owned totals:** persisted orders are recalculated by the backend instead of trusting client-submitted totals.
- **Backend-driven UI data:** frontend SKU and coupon options come from `/products` and `/coupons`, so users do not need to inspect the database.
- **Vite proxy:** frontend calls `/api/*`, and Vite forwards requests to the backend at `localhost:8080`.

## SOLID Principles

- **Single Responsibility:** controllers handle HTTP, services handle business use cases, repositories handle persistence, mappers handle conversions, and strategy classes handle individual promotion rules.
- **Open/Closed:** new promotion rules can be added by implementing the `PromotionStrategy` interface.
- **Liskov Substitution:** all promotion strategies can be executed through the same `PromotionStrategy` contract.
- **Interface Segregation:** services are split by capability: order, coupon, promotion, and pricing.
- **Dependency Inversion:** Spring injects repositories, services, mappers, and promotion strategies instead of manually constructing dependencies.

## Design Patterns

### Strategy Pattern

Each promotion rule is implemented as an independent strategy:

- Buy 2 Get 1
- 10% order discount
- VIP discount
- Coupon discount

### Chain of Responsibility

`PromotionPipeline` executes the registered strategies in sequence. Each strategy updates the shared pricing context and may add an applied discount entry.

## Database Design

Core tables:

- `products`: product catalog used by the frontend SKU dropdown
- `orders`: persisted order totals
- `order_items`: line items belonging to an order
- `promotions`: configured promotion metadata
- `coupons`: coupon rules used by coupon calculation

Important relationships:

- One order has many order items.
- Product SKU is unique.
- Coupon code is unique.
- Order item stores SKU, price, and quantity at the time of calculation.

Seed data is defined in [`backend/order_pricing_promotion_engine_database.sql`](backend/order_pricing_promotion_engine_database.sql). Import it automatically with:

```bash
cd backend/order_pricing_and_promotion_engine
./scripts/setup-local-db.sh
```

The script resets schema and loads products, sample orders, coupons (including `SUMMER10`), and promotion rows for the management UI.

## API Examples

Calculate order:

```http
POST /orders/calculate
Content-Type: application/json
```

```json
{
  "customerType": "VIP",
  "items": [
    { "sku": "A100", "price": 100, "quantity": 2 },
    { "sku": "B200", "price": 50, "quantity": 1 }
  ],
  "couponCode": "SUMMER10"
}
```

Example response:

```json
{
  "subtotal": 250.0,
  "discount": 46.25,
  "finalPrice": 203.75,
  "appliedDiscounts": [
    {
      "code": "PERCENTAGE_10",
      "name": "10% Order Discount",
      "type": "ORDER_PERCENTAGE",
      "amount": 25.0
    },
    {
      "code": "VIP_5",
      "name": "VIP Customer Discount",
      "type": "VIP",
      "amount": 11.25
    },
    {
      "code": "SUMMER10",
      "name": "SUMMER10 Coupon",
      "type": "COUPON",
      "amount": 10.0
    }
  ]
}
```

## Frontend Approach

- Components are decomposed by feature: order metrics, coupon field, line item editor, customer type selector, pricing summary, and promotion cards.
- Redux Toolkit manages async state for pricing calculation, products, coupons, and promotions.
- API calls are isolated in `src/api/pricingApi.ts`.
- Form validation runs before sending requests to the backend.
- The UI handles loading, success, and error states.
- MUI is used for a polished responsive interface.

## How to Run

### 0. Start local database (first time)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
cd backend/order_pricing_and_promotion_engine
./scripts/setup-local-db.sh
```

Details and troubleshooting: [`backend/order_pricing_and_promotion_engine/README.md`](backend/order_pricing_and_promotion_engine/README.md#setup-local-database).

### 1. Start Backend

Use JDK 17. Ensure Postgres is running (step 0).

```powershell
cd backend\order_pricing_and_promotion_engine
.\mvnw.cmd spring-boot:run
```

Or with Maven:

```bash
cd backend/order_pricing_and_promotion_engine
mvn spring-boot:run
```

Quick check:

```bash
curl http://localhost:8080/products
```

Backend URL:

```text
http://localhost:8080
```

### 2. Configure Frontend

Create or verify `frontend/.env.local`:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=/api
```

### 3. Start Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173
```

## Testing

Backend:

```bash
cd backend/order_pricing_and_promotion_engine
mvn test
```

Frontend:

```bash
cd frontend
npm run build
npm run lint
npm run test
```

## Trade-offs

- Promotion behavior is implemented in strategy classes, while the `promotions` table is used for management/listing visibility. A production version would externalize more promotion configuration.
- Product prices are selected from the backend product catalog, but the calculate endpoint still accepts item prices to keep the API stateless and simple.
- Coupon calculation reads from the database, with a `SUMMER10` fallback for demo resilience.
- The promotion pipeline uses a fixed order. More complex systems may need campaign priority, exclusions, eligibility windows, and stackability rules.
- Integration tests with real PostgreSQL are not included.

## Production Thinking

Potential scale concerns:

- Large promotion catalogs need caching and indexed eligibility lookup.
- Frequent product price changes need stronger audit rules.
- Promotion stacking can become difficult without explicit priority and exclusion rules.
- Database connectivity issues should be visible through monitoring.

Monitoring ideas:

- Request latency and error rate for `/orders/calculate`
- Frequency of each applied discount code
- Validation failure counts
- Coupon-not-found counts
- Database connection errors

## Documentation Map

Use this root README for the fullstack submission overview.

Use package READMEs for deeper details:

- Backend: `backend/order_pricing_and_promotion_engine/README.md`
- Frontend: `frontend/README.md`
