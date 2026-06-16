const express = require('express');
const router = express.Router();
const db = require('../db');

//Define the route on the router instance 
router.post('/update-stock', async (req, res) => {
    const { product_id, stock_value } = req.body;

    // Check for missing fields
    if (product_id === undefined || stock_value === undefined) {
        return res.status(400).json({ error: "Missing product_id or stock_value" });
    }

    // 1. Validate product_id (must be a positive integer)
    if (!Number.isInteger(product_id) || product_id <= 0) {
        return res.status(400).json({ error: "Invalid product_id. Must be a positive integer." });
    }

    // 2. Validate stock_value (must be a number and cannot be negative)
    if (typeof stock_value !== 'number' || stock_value < 0) {
        return res.status(400).json({ error: "Invalid stock_value. Must be a non-negative number." });
    }

    try {
    // Step 1: Check if product exists
    const [rows] = await db.execute(
        'SELECT * FROM products WHERE product_id = ?',
        [product_id]
    );

    if (rows.length > 0) {

        // Existing product
        const oldStock = rows[0].stock_quantity;
        const newStock = stock_value;
        const quantityChanged = newStock - oldStock;

        // Update products table
        await db.execute(
            'UPDATE products SET stock_quantity = ? WHERE product_id = ?',
            [newStock, product_id]
        );

        // Insert stock log
        await db.execute(
            `INSERT INTO stock_logs
            (product_id, previous_stock_level, new_stock_level, quantity_changed)
            VALUES (?, ?, ?, ?)`,
            [product_id, oldStock, newStock, quantityChanged]
        );

        return res.json({
            message: "Stock updated successfully"
        });

    } else {

        // New product
        const oldStock = 0;
        const newStock = stock_value;
        const quantityChanged = stock_value;

        // Insert product
        await db.execute(
            'INSERT INTO products (product_id, stock_quantity) VALUES (?, ?)',
            [product_id, newStock]
        );

        // Insert stock log
        await db.execute(
            `INSERT INTO stock_logs
            (product_id, previous_stock_level, new_stock_level, quantity_changed)
            VALUES (?, ?, ?, ?)`,
            [product_id, oldStock, newStock, quantityChanged]
        );

        return res.status(201).json({
            message: "New product and stock inserted"
        });
    }

} catch (err) {
    console.error(err);
    res.status(500).json({
        error: "Database error"
    });
}
});

//Get All products 
router.get('/products', async (req, res) => {
    try {

        const [rows] = await db.execute(
            'SELECT product_id, stock_quantity FROM products'
        );

        return res.json(rows);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Database error'
        });
    }
});

//Get Single Product
router.get('/products/:id', async (req, res) => {
    try {

        const productId = req.params.id;

        const [rows] = await db.execute(
            'SELECT product_id, stock_quantity FROM products WHERE product_id = ?',
            [productId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        return res.json(rows[0]);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Database error'
        });
    }
});

//Get product stock history
router.get('/products/:id/history', async (req, res) => {
    try {
        // Extract the product ID from the URL parameters
        const productId = req.params.id;

        // Fetch the specific product from the database
        const [rows] = await db.execute(
            `SELECT
                log_id,
                product_id,
                previous_stock_level,
                new_stock_level,
                quantity_changed,
                created_at
             FROM stock_logs
             WHERE product_id = ?
             ORDER BY created_at DESC`,
            [productId]
        );
        
        // Handle product not found
        if (rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        // Return the product as a JSON response
        return res.json(rows);
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
    }
});



module.exports=router;