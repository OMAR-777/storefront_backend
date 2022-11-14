CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    order_id bigint REFERENCES orders(id) ON DELETE CASCADE,
    product_id bigint REFERENCES products(id) ON DELETE CASCADE
);