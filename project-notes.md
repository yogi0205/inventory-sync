# Real-Time Inventory Sync System

## 1. Problem Statement

Small shop owners cannot see real-time stock availability from suppliers.

Because of this:
- shops may over-order products
- shops may see outdated stock
- stockouts can happen
- business loses sales

Goal:
Build a backend system where stock updates are synced and shops can fetch latest stock data.

---

# 2. Users in the System

## Supplier
- Updates stock quantity
- Sends stock data to backend

## Shop Owner
- Fetches product stock information
- Reads latest available stock

---

# 3. Current System Flow

Supplier → Backend API → Database

Shop → Backend API → Database → Response

---

# 4. Main Challenge

Main challenge:
- keeping stock data updated correctly
- ensuring shops get latest stock value
- handling multiple requests properly

Future considerations:
- concurrency
- optimization
- caching
- scaling

---

# 5. Database Design

Table: products

Fields:

## product_id
- unique product identifier

## stock_quantity
- stores current available stock

## created_at
- stores product creation time

## updated_at
- stores latest update time

---

# 6. Tech Stack

Backend:
- Node.js
- Express.js

Database:
- MySQL

Packages Used:
- express
- mysql2
- dotenv

---

# 7. Current Project Structure

inventory-sync/
│
├── index.js
├── db.js
├── routes/
│   └── stock.js
├── package.json
└── project-notes.md

---

# 8. Files Understanding

## index.js

Purpose:
- starts express server
- loads middleware
- mounts routes
- test API for DB fetch

Important concepts learned:
- express app setup
- middleware
- route mounting

---

## db.js

Purpose:
- creates MySQL connection pool

Important concepts learned:
- connection pooling
- database configuration

---

## routes/stock.js

Purpose:
- contains stock update API

Current logic:
1. receive request
2. validate request body
3. check if product exists
4. update stock if exists
5. insert new product if not exists

Important concepts learned:
- express router
- async/await
- SQL queries
- update vs insert flow

---

# 9. APIs Implemented

## GET /InventoryDB

Purpose:
- fetch all products from database

Current response:
- list of products with stock data

---

## POST /update-stock

Purpose:
- update stock for existing product
- insert new product if product does not exist

Request body:
{
  "product_id": 1,
  "stock_value": 100
}

---

# 10. Issues Faced

## Issue 1
Column mismatch:
- used stock instead of stock_quantity

Fix:
- corrected SQL queries

---

## Issue 2
Understanding backend flow

Learned:
- request → route → DB → response

---

## Issue 3
Understanding project design

Learned:
- start simple first
- improve step-by-step later

---

# 11. Current Learning Summary

Learned:
- Express server setup
- Routing
- Middleware
- MySQL connection
- Connection pooling
- API testing
- Basic backend architecture
- Database flow

---

# 12. Next Steps

- Fix remaining bugs
- Test update API
- Create get products API
- Add validation
- Handle negative stock
- Improve system design later

# 13. Features Implemented

## Backend Setup
Implemented:
- Express.js server
- MySQL database connection
- Connection pooling using mysql2/promise

Learned:
- Express app structure
- Middleware usage
- Database connection setup

---

## Update Stock API

API:
POST /update-stock

Implemented:
- update stock for existing product
- insert new product if product does not exist

Flow:
1. receive request body
2. validate input
3. check if product exists
4. update or insert data
5. send JSON response

Learned:
- POST APIs
- async/await
- SQL UPDATE query
- SQL INSERT query
- conditional backend logic

---

## Get Products API

API:
GET /products

Implemented:
- fetch all products
- return product_id and stock_quantity

Learned:
- GET APIs
- SELECT query
- JSON response handling

---

## Get Single Product API

API:
GET /products/:id

Implemented:
- fetch single product using route params
- return 404 if product not found

Learned:
- route parameters
- dynamic routes
- handling missing data
- proper API status codes

---

# 14. Validation Implemented

## product_id validation

Handled:
- negative values
- invalid string values
- missing values

Learned:
- backend input validation
- protecting data correctness

---

## stock_value validation

Handled:
- negative stock values
- invalid input

Learned:
- business rule validation
- preventing invalid DB updates

---

# 15. Issues Faced and Fixes

## Issue 1: Callback error with mysql2/promise

Error:
Callback function is not available with promise clients

Reason:
- used callback style with promise-based mysql2

Fix:
- changed to async/await with try/catch

Learned:
- difference between callbacks and promises
- promise-based DB handling

---

## Issue 2: Column mismatch

Problem:
- used stock instead of stock_quantity

Fix:
- corrected SQL queries

Learned:
- importance of DB schema consistency

---

## Issue 3: Understanding Backend Flow

Initially confused about:
- where queries should be written
- how routes connect to DB

Learned flow:
Request → Route → DB Query → Response

---

# 16. Current Backend Concepts Learned

Learned:
- Express routing
- Express middleware
- REST APIs
- MySQL queries
- Connection pooling
- Route separation
- Validation
- Error handling
- Async/await
- Promise-based DB queries
- API response structure
- Backend request/response cycle

---

# 17. Current Project Understanding

Current system flow:

Supplier
→ POST /update-stock
→ Backend validates request
→ Database update/insert

Shop
→ GET /products
→ Backend fetches products
→ JSON response returned

# 18. Inventory Audit Logging

## Problem

The products table only stores the latest stock value.

Example:

Product 1 stock changed:

100 → 150 → 200 → 250

products table only shows:

250

Previous changes are lost.

---

## Solution

Created a new table:

stock_logs

Purpose:
- maintain inventory history
- track every stock change
- support auditing and debugging

---

## Table: stock_logs

Fields:

log_id
- unique log identifier

product_id
- identifies the product

previous_stock_level
- stock before update

new_stock_level
- stock after update

quantity_changed
- difference between new and old stock

Formula:

quantity_changed = new_stock_level - previous_stock_level

Examples:

200 → 250 = +50

250 → 220 = -30

0 → 100 = +100

created_at
- timestamp of stock change

---

## Update Stock Flow

For Existing Product:

1. Fetch current stock
2. Store old stock value
3. Calculate stock difference
4. Update products table
5. Insert stock log record

Example:

oldStock = 200
newStock = 250

quantityChanged = 50

Stock Log:

product_id = 1
previous_stock_level = 200
new_stock_level = 250
quantity_changed = 50

---

## New Product Flow

1. Product not found
2. Insert into products table
3. Create initial stock log

Example:

oldStock = 0
newStock = 100

quantityChanged = 100

Stock Log:

product_id = 2
previous_stock_level = 0
new_stock_level = 100
quantity_changed = 100

---

## Concepts Learned

Learned:
- audit logging
- inventory history tracking
- business event recording
- stock movement tracking
- update workflow design

# 19. Product Stock History API

## Problem

The system stores stock history in stock_logs.

Users need a way to view historical stock changes.

---

## API

GET /products/:id/history

Example:

GET /products/1/history

Purpose:
- fetch stock movement history for a product

---

## Query Used

SELECT
    log_id,
    product_id,
    previous_stock_level,
    new_stock_level,
    quantity_changed,
    created_at
FROM stock_logs
WHERE product_id = ?
ORDER BY created_at DESC;

---

## Response

Returns list of stock log records.

Example:

[
  {
    "log_id": 2,
    "product_id": 1,
    "previous_stock_level": 200,
    "new_stock_level": 250,
    "quantity_changed": 50
  }
]

---

## Concepts Learned

Learned:
- historical data retrieval
- filtering records
- ORDER BY
- route parameters
- audit trail access

# 20. Architecture Decisions

Why separate products and stock_logs?

products:
- stores current inventory state
- optimized for current stock lookups

stock_logs:
- stores historical inventory movements
- supports auditing
- supports debugging
- supports future reporting

Benefit:
- fast current stock reads
- complete inventory history