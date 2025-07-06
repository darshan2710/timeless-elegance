// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // Import the db.js file for MySQL connection

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());        // To parse JSON bodies
app.use(express.static('public')); // Serve static files like HTML, CSS, JS

// Route to add an item to the cart
app.post('/api/add-to-cart', (req, res) => {
    const {productName, price} = req.body;

    // Check if the product already exists in the cart
    const checkQuery = 'SELECT * FROM cart WHERE product_name = ?';
    db.query(checkQuery, [ productName ], (err, results) => {
        if (err) {
            console.error('Error checking cart:', err);
            return res.status(500).json({message : 'Database error'});
        }

        if (results.length > 0) {
            // Product exists, update the quantity
            const updateQuery = 'UPDATE cart SET quantity = quantity + 1 WHERE product_name = ?';
            db.query(updateQuery, [ productName ], (err, updateResults) => {
                if (err) {
                    console.error('Error updating cart:', err);
                    return res.status(500).json({message : 'Database error'});
                }
                res.status(200).json({message : 'Cart updated successfully!'});
            });
        }
        else {
            // Product doesn't exist, insert new row
            const insertQuery = 'INSERT INTO cart (product_name, price, quantity) VALUES (?, ?, 1)';
            db.query(insertQuery, [ productName, price ], (err, insertResults) => {
                if (err) {
                    console.error('Error inserting into cart:', err);
                    return res.status(500).json({message : 'Database error'});
                }
                res.status(200).json({message : 'Item added to cart successfully!'});
            });
        }
    });
});

// Get cart items
app.get('/api/cart', (req, res) => {
    const query = 'SELECT * FROM cart';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).json({message : 'Failed to load cart items'});
        }
        res.json({cartItems : results});
    });
});

// Empty the cart
app.delete('/api/empty-cart', (req, res) => {
    db.query('DELETE FROM cart', (err) => {
        if (err) {
            console.error('Error emptying cart:', err);
            return res.status(500).json({message : 'Failed to empty cart'});
        }
        res.json({message : 'Cart emptied successfully!'});
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
