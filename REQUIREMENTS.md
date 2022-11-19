# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `GET: /products`
- Show `GET: /products/:id`
- Create [token required] `POST: /products`

#### Users
- Index [token required] `GET: /users`
- Show [token required] `GET: /users/:id`
- Get User Profile [token required] `GET: /users/me`
- Login `POST: /users/login`
- Sign Up `POST: /users`
- Create N[token required] `POST: /users/createMany`

#### Orders
- Create Order [token required] `POST: /orders/create`
- Current Order by user [token required] `GET: /orders/cart`
- Add Order products [token required] `POST: /orders/:id/products`
- Get Order products [token required] `GET: /orders/:id/products`
- Complete Order [token required] `POST: /orders/:id/complete`
- Completed Orders by user [token required] `GET: /orders`

## Data Shapes

#### Users
- id
- firstName
- lastName
- email
- password

SQL Schema:
```
users (
  id SERIAL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);
```

#### Products
-  id
- name
- price

SQL Schema:
```
products (
  id SERIAL,
  name VARCHAR(255) NOT NULL UNIQUE,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);
```

#### Orders
- id
- status of order (active or complete)
- user_id

SQL Schema:
```
orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id bigint REFERENCES users(id) ON DELETE CASCADE
);
```

## Order Products
- id
- quantity
- order_id
- product_id

SQL Schema:
```
order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    order_id bigint REFERENCES orders(id) ON DELETE CASCADE,
    product_id bigint REFERENCES products(id) ON DELETE CASCADE
);
```


