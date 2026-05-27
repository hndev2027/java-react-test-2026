CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    price DECIMAL(10,2) NOT NULL
);
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer_type VARCHAR(20) NOT NULL, -- VIP / NORMAL
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2) NOT NULL,
    coupon_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    sku VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL
);
CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20), -- FIXED / PERCENT
    value DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);
CREATE TABLE promotions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(50), -- VIP / PERCENTAGE / BUY_X_GET_Y
    value DECIMAL(10,2),
    active BOOLEAN DEFAULT TRUE
);

INSERT INTO products (sku, name, price) VALUES
('A100', 'Product A', 100.00),
('B200', 'Product B', 50.00),
('C300', 'Product C', 30.00),
('D400', 'Product D', 200.00),
('E500', 'Product E', 80.00);

INSERT INTO orders (customer_type, subtotal, discount, final_price, coupon_code) VALUES
('VIP', 250.00, 25.00, 225.00, 'SUMMER10'),
('NORMAL', 180.00, 10.00, 170.00, 'SAVE10'),
('VIP', 500.00, 50.00, 450.00, 'VIP50'),
('NORMAL', 120.00, 5.00, 115.00, NULL),
('VIP', 300.00, 30.00, 270.00, 'OFF30');

INSERT INTO order_items (order_id, sku, price, quantity) VALUES
(1, 'A100', 100.00, 2),
(1, 'B200', 50.00, 1),
(2, 'C300', 30.00, 2),
(2, 'B200', 50.00, 2),
(3, 'D400', 200.00, 2),
(4, 'E500', 80.00, 1),
(4, 'C300', 30.00, 1),
(5, 'A100', 100.00, 3),
(5, 'B200', 50.00, 1),
(5, 'C300', 30.00, 1);

INSERT INTO coupons (code, discount_type, value, active) VALUES
('SUMMER10', 'FIXED', 10.00, true),
('SAVE10', 'PERCENT', 10.00, true),
('VIP50', 'FIXED', 50.00, true),
('OFF30', 'PERCENT', 30.00, true),
('NEWUSER', 'FIXED', 20.00, true);

INSERT INTO promotions (name, type, value, active) VALUES
('VIP Discount', 'VIP', 5.00, true),
('Seasonal Discount', 'PERCENTAGE', 10.00, true),
('Buy 2 Get 1', 'BUY_X_GET_Y', 0.00, true),
('Black Friday', 'PERCENTAGE', 20.00, true),
('Clearance Sale', 'PERCENTAGE', 15.00, true);