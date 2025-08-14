const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const cors = require('cors');
const path = require('path');
const AlertService = require('./services/AlertService');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const alertService = new AlertService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database(':memory:');

// Initialize database
db.serialize(() => {
    // Create products table
    db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        expiration_date DATE NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert dummy data
    const dummyProducts = [
        ['Milk', 'Dairy', '2025-09-16', 50, 3.99], // Tomorrow
        ['Bread', 'Bakery', '2025-08-17', 30, 2.49], // Day after tomorrow
        ['Yogurt', 'Dairy', '2025-10-20', 25, 1.99], // Within 7 days
        ['Cheese', 'Dairy', '2025-11-22', 15, 5.99], // Within 7 days
        ['Apples', 'Fruits', '2025-11-18', 100, 4.99], // Within 7 days
        ['Bananas', 'Fruits', '2025-11-19', 80, 2.99], // Within 7 days
        ['Chicken Breast', 'Meat', '2025-10-21', 20, 8.99], // Within 7 days
        ['Ground Beef', 'Meat', '2025-08-15', 10, 6.99], // Tomorrow
        ['Lettuce', 'Vegetables', '2025-01-17', 40, 1.99], // Day after tomorrow
        ['Tomatoes', 'Vegetables', '2025-01-20', 60, 3.49], // Within 7 days
        ['Orange Juice', 'Beverages', '2025-01-25', 35, 4.49], // More than 7 days
        ['Pasta', 'Pantry', '2025-06-15', 100, 1.99], // Long shelf life
        ['Rice', 'Pantry', '2025-12-31', 50, 3.99], // Very long shelf life
        ['Eggs', 'Dairy', '2025-01-23', 24, 3.49], // Within 7 days
        ['Salmon Fillet', 'Seafood', '2025-01-16', 8, 12.99], // Tomorrow
        ['Spinach', 'Vegetables', '2025-01-18', 30, 2.99], // Within 7 days
        ['Strawberries', 'Fruits', '2025-01-17', 20, 5.99], // Day after tomorrow
        ['Pork Chops', 'Meat', '2025-01-19', 12, 7.99], // Within 7 days
        ['Bell Peppers', 'Vegetables', '2025-01-21', 25, 3.99], // Within 7 days
        ['Greek Yogurt', 'Dairy', '2025-01-22', 18, 4.99] // Within 7 days
    ];

    const stmt = db.prepare('INSERT INTO products (name, category, expiration_date, quantity, price) VALUES (?, ?, ?, ?, ?)');
    dummyProducts.forEach(product => {
        stmt.run(product);
    });
    stmt.finalize();

    console.log('✅ Database initialized with dummy data');
});

// Helper functions
const getProductsExpiringInDays = (days, exactMatch = true) => {
    return new Promise((resolve, reject) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        const dateStr = targetDate.toISOString().split('T')[0];
        
        if (exactMatch) {
            db.all(
                'SELECT * FROM products WHERE expiration_date = ?',
                [dateStr],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        } else {
            db.all(
                'SELECT * FROM products WHERE expiration_date <= ? AND expiration_date >= date("now")',
                [dateStr],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        }
    });
};

const getProductsExpiringWithinDays = (days) => {
    return new Promise((resolve, reject) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        const dateStr = targetDate.toISOString().split('T')[0];
        
        db.all(
            'SELECT * FROM products WHERE expiration_date <= ? AND expiration_date >= date("now")',
            [dateStr],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};

// Cron Jobs
// Job 1: Check for products expiring within 7 days (runs daily at 9:00 AM)
cron.schedule('0 9 * * *', async () => {
    console.log('🕘 Running scheduled 7-day expiration check...');
    try {
        const products = await getProductsExpiringWithinDays(7);
        await alertService.sendExpirationAlert(products, '7-day');
    } catch (error) {
        console.error('❌ Error in 7-day expiration check:', error);
    }
});

// Job 2: Check for products expiring tomorrow (runs daily at 6:00 PM)
cron.schedule('0 18 * * *', async () => {
    console.log('🕕 Running scheduled tomorrow expiration check...');
    try {
        const products = await getProductsExpiringInDays(1);
        await alertService.sendExpirationAlert(products, 'tomorrow');
    } catch (error) {
        console.error('❌ Error in tomorrow expiration check:', error);
    }
});

// Test scheduler (runs every 2 minutes for demonstration)
cron.schedule('*/2 * * * *', async () => {
    console.log('🔄 Running test expiration checks with recipe suggestions...');
    try {
        const tomorrowProducts = await getProductsExpiringInDays(1);
        const weekProducts = await getProductsExpiringWithinDays(7);
        
        if (tomorrowProducts.length > 0 || weekProducts.length > 0) {
            if (tomorrowProducts.length > 0) {
                await alertService.sendExpirationAlert(tomorrowProducts, 'tomorrow');
            }
            if (weekProducts.length > 0) {
                await alertService.sendExpirationAlert(weekProducts, '7-day');
            }
        } else {
            console.log('ℹ️  No products expiring soon - all inventory is healthy! ✅');
        }
    } catch (error) {
        console.error('❌ Error in test expiration check:', error);
    }
});

// REST API Endpoints

// Get all products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products ORDER BY expiration_date ASC', (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (!row) {
            return res.status(404).json({ 
                success: false, 
                error: 'Product not found' 
            });
        }
        
        res.json({
            success: true,
            data: row
        });
    });
});

// Create new product
app.post('/api/products', (req, res) => {
    const { name, category, expiration_date, quantity, price } = req.body;
    
    // Basic validation
    if (!name || !category || !expiration_date || !quantity || !price) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required: name, category, expiration_date, quantity, price'
        });
    }
    
    db.run(
        'INSERT INTO products (name, category, expiration_date, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [name, category, expiration_date, quantity, price],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            res.status(201).json({
                success: true,
                data: {
                    id: this.lastID,
                    name,
                    category,
                    expiration_date,
                    quantity,
                    price
                }
            });
        }
    );
});

// Update product
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, expiration_date, quantity, price } = req.body;
    
    if (!name || !category || !expiration_date || !quantity || !price) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required: name, category, expiration_date, quantity, price'
        });
    }
    
    db.run(
        'UPDATE products SET name = ?, category = ?, expiration_date = ?, quantity = ?, price = ? WHERE id = ?',
        [name, category, expiration_date, quantity, price, id],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            
            res.json({
                success: true,
                data: {
                    id: parseInt(id),
                    name,
                    category,
                    expiration_date,
                    quantity,
                    price
                }
            });
        }
    );
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    });
});

// Get products expiring within specified days
app.get('/api/products/expiring/:days', async (req, res) => {
    const { days } = req.params;
    
    try {
        const products = await getProductsExpiringWithinDays(parseInt(days));
        res.json({
            success: true,
            data: products,
            count: products.length,
            message: `Products expiring within ${days} day(s)`
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get alert history
app.get('/api/alerts/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const history = alertService.getAlertHistory(limit);
    
    res.json({
        success: true,
        data: history,
        count: history.length
    });
});

// Get alert statistics
app.get('/api/alerts/stats', (req, res) => {
    const stats = alertService.getAlertStats();
    
    res.json({
        success: true,
        data: stats
    });
});

// Get recipe suggestions for a product
app.get('/api/recipes/:productName', (req, res) => {
    const { productName } = req.params;
    const RecipeService = require('./services/RecipeService');
    const recipeService = new RecipeService();
    
    const recipes = recipeService.getRecipesForProduct(productName);
    
    res.json({
        success: true,
        data: recipes,
        count: recipes.length,
        product: productName
    });
});

// Trigger manual alert check
app.post('/api/alerts/check', async (req, res) => {
    try {
        const tomorrowProducts = await getProductsExpiringInDays(1);
        const weekProducts = await getProductsExpiringWithinDays(7);
        
        const results = [];
        
        if (tomorrowProducts.length > 0) {
            const result = await alertService.sendExpirationAlert(tomorrowProducts, 'tomorrow');
            results.push(result);
        }
        
        if (weekProducts.length > 0) {
            const result = await alertService.sendExpirationAlert(weekProducts, '7-day');
            results.push(result);
        }
        
        res.json({
            success: true,
            message: 'Manual alert check completed',
            results: results,
            totalAlerts: results.length
        });
    } catch (error) {
        console.error('Error in manual alert check:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to run manual alert check'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Product Expiration Monitor API',
        version: '1.0.0',
        endpoints: {
            'GET /api/products': 'Get all products',
            'GET /api/products/:id': 'Get product by ID',
            'POST /api/products': 'Create new product',
            'PUT /api/products/:id': 'Update product',
            'DELETE /api/products/:id': 'Delete product',
            'GET /api/products/expiring/:days': 'Get products expiring within X days',
            'GET /api/alerts/history': 'Get alert history',
            'GET /api/alerts/stats': 'Get alert statistics',
            'GET /api/recipes/:productName': 'Get recipe suggestions for product',
            'POST /api/alerts/check': 'Trigger manual alert check',
            'GET /health': 'Health check'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Enhanced Product Expiration Monitor started successfully!');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log('⏰ Enhanced cron jobs scheduled:');
    console.log('   - 7-day expiration check: Daily at 9:00 AM');
    console.log('   - Tomorrow expiration check: Daily at 6:00 PM');
    console.log('   - Test checks with recipes: Every 2 minutes');
    console.log('📊 API endpoints available at /api/products');
    console.log('🍳 Recipe suggestions available at /api/recipes');
    console.log('📧 Alert system with email simulation enabled');
    console.log('🏥 Health check available at /health');
    console.log('');
    console.log('🎯 New Features:');
    console.log('   ✅ Enhanced alerts with recipe suggestions');
    console.log('   ✅ Email notifications (simulated)');
    console.log('   ✅ Alert history tracking');
    console.log('   ✅ Recipe database with 50+ recipes');
    console.log('   ✅ Manual alert triggers');
    console.log('   ✅ Alert statistics and analytics');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});