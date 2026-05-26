# Backend - Order Pricing & Promotion Engine

Spring Boot backend for Challenge 1: Order Pricing & Promotion Engine.

This README focuses on the backend package. For the complete fullstack submission overview, see the repository root `README.md`.

The service calculates an order final price by applying a promotion pipeline over the submitted order items. It is designed to support both direct system-to-system calls and UI calls from the React frontend.

## Features

- Stateless REST API for order price calculation
- Order, promotion, coupon, and product APIs
- Product catalog endpoint used by the frontend SKU dropdown
- Coupon list endpoint used by the frontend coupon details dialog
- Applied discount breakdown in calculate response
- Structured JSON error responses for UI and service callers
- PostgreSQL database with JPA entities
- Strategy Pattern for promotion rules
- Chain of Responsibility style promotion pipeline
- Unit tests for service and promotion behavior
- CORS configured for local frontend development on `localhost` and `127.0.0.1`

## Tech Stack

- Java 17
- Spring Boot
- Spring Web MVC
- Spring Data JPA / Hibernate
- PostgreSQL
- MapStruct
- Lombok
- Jakarta Validation
- JUnit 5 / Mockito
- Maven

## Architecture

The backend follows a layered structure:

```text
Controller -> Service -> Repository -> Mapper -> Entity
```

Main packages:

- `controller`: REST API endpoints
- `service`: business use cases
- `promotion`: promotion strategy implementations and pipeline
- `repository`: Spring Data JPA repositories
- `mapper`: MapStruct DTO/entity mappers
- `dto`: request/response contracts
- `entity`: database models
- `exception`: centralized error handling
- `config`: web configuration such as CORS

### Architecture Decisions

- **Stateless API contract:** `POST /orders/calculate` accepts the full order context in the request body. It does not depend on browser sessions, cookies, or server-side temporary state. This makes the same endpoint usable by both the React UI and another backend service.
- **DTOs at the API boundary:** controllers expose request/response DTOs instead of JPA entities. This keeps persistence details out of the public API and makes the JSON contract easier to evolve.
- **Dedicated pricing context:** promotion strategies work on `PricingContextDTO`, which contains subtotal, running total, total discount, and applied discount details. This keeps pricing-specific state separate from database entities.
- **Centralized error handling:** `GlobalExceptionHandler` produces consistent machine-readable errors for validation and domain failures.
- **Backend-owned totals:** order creation recalculates totals on the server instead of trusting client-submitted `subtotal`, `discount`, or `finalPrice`.
- **Frontend catalog support:** `/products` and `/coupons` are exposed so the UI can avoid hardcoded SKU/coupon knowledge and remain aligned with database data.

## SOLID Principles

- **Single Responsibility Principle:** controllers handle HTTP concerns, services handle use cases, repositories handle persistence, mappers handle DTO/entity conversion, and promotion strategies handle individual discount rules.
- **Open/Closed Principle:** new promotion rules can be added by implementing `PromotionStrategy` and registering it as a Spring bean. Existing pricing flow does not need to be rewritten.
- **Liskov Substitution Principle:** all promotion implementations can be used anywhere a `PromotionStrategy` is expected because they share the same `apply(PricingContextDTO context)` contract.
- **Interface Segregation Principle:** service interfaces such as `OrderService`, `ProductService`, `CouponService`, `PromotionService`, and `PricingService` expose focused operations rather than one large application service.
- **Dependency Inversion Principle:** services depend on abstractions and injected collaborators such as repositories, mappers, and the promotion pipeline. Spring dependency injection wires implementations at runtime.

## Design Patterns

### Strategy Pattern

Each promotion rule is isolated behind `PromotionStrategy`.

Current strategies:

- `BuyXGetYStrategy`
- `PercentageDiscountStrategy`
- `VipDiscountStrategy`
- `CouponStrategy`

This keeps the pricing engine open for extension. A new promotion can be added by creating another strategy without rewriting the existing pricing service.

### Chain of Responsibility

`PromotionPipeline` receives all `PromotionStrategy` beans and executes them in order. Each strategy can mutate the shared `PricingContextDTO` by applying a discount.

Execution order:

1. Buy X Get Y
2. 10% order percentage discount
3. VIP customer discount
4. Coupon discount

## API Endpoints

### Orders

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/orders/calculate` | Calculate subtotal, discount, final price, and applied discount breakdown |
| `POST` | `/orders` | Create an order. Backend recalculates totals before saving |
| `GET` | `/orders` | List orders |
| `GET` | `/orders/{id}` | Get order by id |
| `PUT` | `/orders/{id}` | Update order |
| `DELETE` | `/orders/{id}` | Delete order |

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/products` | List product catalog for frontend SKU dropdown |

Example response:

```json
[
  {
    "id": 1,
    "sku": "A100",
    "name": "Product A",
    "price": 100.00
  }
]
```

### Promotions

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/promotions` | Create promotion |
| `GET` | `/promotions` | List configured promotions |
| `GET` | `/promotions/{id}` | Get promotion by id |
| `PUT` | `/promotions/{id}` | Update promotion |
| `DELETE` | `/promotions/{id}` | Delete promotion |

### Coupons

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/coupons` | Create coupon |
| `GET` | `/coupons` | List coupons for frontend presets and coupon detail dialog |
| `GET` | `/coupons/{id}` | Get coupon by id |
| `PUT` | `/coupons/{id}` | Update coupon |
| `DELETE` | `/coupons/{id}` | Delete coupon |

Example response:

```json
[
  {
    "id": 1,
    "code": "SUMMER10",
    "discountType": "FIXED",
    "value": 10.00,
    "active": true
  }
]
```

## Calculate Order

`POST /orders/calculate`

Request:

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

Response:

```json
{
  "subtotal": 250.00,
  "discount": 46.25,
  "finalPrice": 203.75,
  "appliedDiscounts": [
    {
      "code": "PERCENTAGE_10",
      "name": "10% Order Discount",
      "type": "ORDER_PERCENTAGE",
      "amount": 25.00
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
      "amount": 10.00
    }
  ]
}
```

Notes:

- Discounts are capped so the final price never goes below zero.
- Coupon values are loaded from the `coupons` table when available.
- `SUMMER10` has a fallback in code so demos still work if the coupons table is empty.
- `customerType` is a `CustomerType` enum: `NORMAL` or `VIP` (case-insensitive in JSON).
- Discounts apply in pipeline order on the **running total** after each step (not all on original subtotal).

## Create Order

`POST /orders`

The backend does not trust price totals from the client. It recalculates `subtotal`, `discount`, and `finalPrice` from the submitted items and coupon before saving.

Request:

```json
{
  "customerType": "VIP",
  "couponCode": "SUMMER10",
  "items": [
    { "sku": "A100", "price": 100.00, "quantity": 2 },
    { "sku": "B200", "price": 50.00, "quantity": 1 }
  ]
}
```

Validation notes:

- `items` must not be empty.

## Error Response

Validation and domain errors return structured JSON:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request",
  "details": {
    "items[0].price": "must be greater than or equal to 0.0"
  },
  "status": 400,
  "timestamp": "2026-04-25T09:30:00"
}
```

This format is machine-readable for both the React UI and service-to-service callers.

## Database Tables

Core tables:

- `products`
- `orders`
- `order_items`
- `promotions`
- `coupons`

### Database Design

`products` stores the product catalog used by the frontend SKU dropdown and by users when building orders.

| Column | Purpose |
| --- | --- |
| `id` | Surrogate primary key |
| `sku` | Unique product identifier used in order items |
| `name` | Display name |
| `price` | Current unit price |

`orders` stores persisted order totals. Totals are generated by backend calculation logic.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `customer_type` | `NORMAL` or `VIP` |
| `subtotal` | Sum of line item prices before discounts |
| `discount` | Total applied discount |
| `final_price` | Subtotal minus discount |
| `coupon_code` | Optional coupon applied during pricing |
| `created_at` | Order creation timestamp |

`order_items` stores individual order lines.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `order_id` | Foreign key to `orders` |
| `sku` | Product SKU at time of order |
| `price` | Unit price at time of order |
| `quantity` | Ordered quantity |

`promotions` stores visible promotion configuration for management/listing.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `name` | Promotion display name |
| `type` | Rule type such as `ORDER_PERCENTAGE`, `BUY_X_GET_Y`, `VIP` |
| `value` | Configured promotion value |
| `active` | Whether the promotion is enabled |

`coupons` stores coupon rules used by `CouponStrategy`.

| Column | Purpose |
| --- | --- |
| `id` | Primary key |
| `code` | Unique coupon code |
| `discount_type` | `FIXED` or `PERCENT` |
| `value` | Fixed amount or percentage value |
| `active` | Whether the coupon can be applied |

Relationship summary:

- One `orders` row has many `order_items` rows.
- `products.sku` is unique and is used by frontend selection.
- `coupons.code` is unique and is looked up by `CouponStrategy`.
- Promotions are listed from the database, while core strategy behavior remains in code for a clear Strategy Pattern implementation.

### Seed data

Full DDL and seed inserts live in [`backend/order_pricing_promotion_engine_database.sql`](../order_pricing_promotion_engine_database.sql).

Load locally:

```bash
./scripts/setup-local-db.sh
```

Sample coupons after seed: `SUMMER10` (FIXED $10), `SAVE10` (PERCENT 10%), `VIP50`, `OFF30`, `NEWUSER`.

## Frontend Integration

The React frontend calls this backend through Vite proxy:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=/api
```

Frontend dev server requests:

```text
/api/orders/calculate -> http://localhost:8080/orders/calculate
/api/products -> http://localhost:8080/products
/api/coupons -> http://localhost:8080/coupons
/api/promotions -> http://localhost:8080/promotions
```

The backend CORS config allows local dev origins:

```text
http://localhost:*
http://127.0.0.1:*
```

### Frontend Approach

The frontend is implemented with React, TypeScript, MUI, and Redux Toolkit.

Key UI decisions:

- **Order Builder:** users select customer type, choose SKUs from a backend-driven dropdown, edit quantities, apply coupon codes, and submit calculation requests.
- **Backend-driven SKU selection:** products are loaded from `GET /products`, so users do not need to inspect the database manually.
- **Coupon UX:** coupons are loaded from `GET /coupons`; the UI shows coupon chips and a details dialog opened by an icon button so users can understand how a coupon works before applying it.
- **Pricing Result Panel:** shows loading, success, error, subtotal, total discount, final price, and applied discount breakdown.
- **Promotion Page:** lists configured promotions from `GET /promotions`.
- **State management:** Redux Toolkit stores async state for pricing, promotions, products, and coupons. Each async request has loading, success, and error states.
- **API integration:** frontend uses a Vite `/api` proxy to avoid hardcoding backend hostnames in components.
- **Validation:** line items are validated on the client before sending requests. The backend still validates requests and returns structured errors.
- **Responsive layout:** MUI grid/stack layout supports desktop and tablet screens.

## Setup Local Database

The backend defaults to a **local PostgreSQL** instance.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)

### One-command setup

From the backend module directory:

```bash
cd backend/order_pricing_and_promotion_engine
./scripts/setup-local-db.sh
```

The script will:

1. Create/start a Docker container named `order-pricing-postgres` (Postgres 16)
2. Create database `order_pricing` with user/password `postgres` / `postgres`
3. Reset schema and import seed data from [`backend/order_pricing_promotion_engine_database.sql`](../order_pricing_promotion_engine_database.sql)

Default connection (already in `application.properties`):

```text
DB_URL=jdbc:postgresql://localhost:5432/order_pricing
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Override when needed:

```bash
DB_PORT=5433 DB_PASSWORD=secret ./scripts/setup-local-db.sh
```

### Run backend after DB is ready

```bash
cd backend/order_pricing_and_promotion_engine
mvn spring-boot:run
```

Quick check:

```bash
curl http://localhost:8080/products
```

### Troubleshooting

| Issue | Fix |
| --- | --- |
| Port `5432` already in use | Stop local Postgres or run with `DB_PORT=5433` and set `DB_URL=jdbc:postgresql://localhost:5433/order_pricing` |
| Container in bad state | `docker rm -f order-pricing-postgres` then re-run `./scripts/setup-local-db.sh` |
| Empty tables / stale data | Re-run `./scripts/setup-local-db.sh` (resets schema and re-imports seed) |
| Docker not running | Start Docker Desktop, then run the script again |

### Optional: cloud database

To use a hosted Postgres instead of local Docker, export env vars before starting the app:

```bash
export DB_URL="jdbc:postgresql://<host>:<port>/<database>?sslmode=require"
export DB_USERNAME="<user>"
export DB_PASSWORD="<password>"
mvn spring-boot:run
```

Do not commit real database passwords to git.

## How to Run

### Backend

Use JDK 17. Ensure local DB is running (see [Setup Local Database](#setup-local-database)).

```bash
mvn clean install
mvn spring-boot:run
```

On Windows with Maven wrapper:

```powershell
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend

From the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on Vite's selected port, usually:

```text
http://localhost:5173
```

## Environment Variables

Datasource is configured in `src/main/resources/application.properties` with env overrides:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/order_pricing}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
```

Example:

```text
DB_URL=jdbc:postgresql://localhost:5432/order_pricing
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Do not commit real production database passwords.

## Testing

Run backend tests:

```bash
mvn test
```

Current tests cover:

- Order service behavior
- Pricing service calculation flow
- Promotion strategy rules and edge cases

## Trade-offs

- Promotion strategies are modular, but percentage and VIP discount rates are still coded in strategy classes.
- Coupons are loaded from the database, with a `SUMMER10` fallback for demos.
- Product prices are selected by the frontend from `/products`, but the calculate endpoint still accepts item prices in the request for a simple stateless contract.
- Integration tests with a real PostgreSQL database are not included yet.
- `promotions` are currently used for listing/management visibility, while executable promotion behavior is represented by strategy classes. A production version would fully externalize promotion configuration.
- The system uses simple numeric discount ordering. More complex retail systems may require stacking rules, exclusions, campaign priority, and eligibility windows.

## Production Thinking

What could break at scale:

- Large promotion catalogs may require caching and indexed eligibility lookup.
- Complex promotion stacking can become hard to reason about without explicit priority and exclusion rules.
- Product price changes can create audit requirements; persisted order items should retain the price used at calculation time.
- Concurrent order creation should not rely on client-computed totals.

Monitoring ideas:

- Track count and latency of `/orders/calculate` calls.
- Track validation failures and coupon-not-found usage.
- Track which promotions fire most often via `appliedDiscounts` codes.
- Alert on spikes in 4xx/5xx responses or database connectivity errors.

## Future Improvements

- Load all promotion configuration dynamically from the database
- Simplify `POST /orders` body (drop required client totals; rely on recalculation only)
- Add enums for `promotion.type` and `coupon.discountType` in API responses
- Add OpenAPI/Swagger documentation
- Add Testcontainers integration tests
- Add audit fields and more production-grade logging
- Add monitoring metrics for pricing failures and promotion usage
