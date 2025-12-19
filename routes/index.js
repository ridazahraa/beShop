const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Home page route with pagination and filtering
router.get("/", async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    // Build query object for filtering
    const query = {};

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Fetch products from database with pagination
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Build queries for category-specific products with filters
    const forHerQuery = { category: "for-her" };
    const forHimQuery = { category: "for-him" };

    // Apply price filters to both category queries
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) {
        priceFilter.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        priceFilter.$lte = parseFloat(req.query.maxPrice);
      }
      forHerQuery.price = priceFilter;
      forHimQuery.price = priceFilter;
    }

    // Fetch products by category with filters applied
    const forHerProducts = await Product.find(forHerQuery)
      .limit(limit)
      .sort({ createdAt: -1 });

    const forHimProducts = await Product.find(forHimQuery)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.render("index", {
      title: "BeShop - Home",
      forHerProducts,
      forHimProducts,
      currentPage: page,
      totalPages,
      totalProducts,
      filters: {
        category: req.query.category || "",
        minPrice: req.query.minPrice || "",
        maxPrice: req.query.maxPrice || "",
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error loading products");
  }
});

// Test route to setup cart for testing order functionality
router.get("/test-cart", (req, res) => {
  // Initialize session cart with test data
  req.session.cart = [
    {
      productId: "507f1f77bcf86cd799439011", // Mock MongoDB ObjectId
      name: "Wireless Headphones",
      price: 99.99,
      quantity: 2,
    },
    {
      productId: "507f1f77bcf86cd799439012",
      name: "Gaming Mouse",
      price: 45.5,
      quantity: 1,
    },
    {
      productId: "507f1f77bcf86cd799439013",
      name: "USB Keyboard",
      price: 75.0,
      quantity: 1,
    },
  ];

  res.send(`
    <html>
      <head>
        <title>Test Cart Setup</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .success { background: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; }
          .links { margin-top: 20px; }
          .links a { display: inline-block; margin-right: 10px; padding: 10px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          .links a:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <h1>✅ Test Cart Created Successfully!</h1>
        <div class="success">
          <strong>Cart Contents:</strong>
          <ul>
            <li>Wireless Headphones - $99.99 × 2 = $199.98</li>
            <li>Gaming Mouse - $45.50 × 1 = $45.50</li>
            <li>USB Keyboard - $75.00 × 1 = $75.00</li>
          </ul>
          <strong>Total: $320.48</strong>
        </div>
        
        <div class="links">
          <h3>🔗 Test Links:</h3>
          <a href="/order/preview">📋 Order Preview</a>
          <a href="/order/my-orders">📝 My Orders</a>
          <a href="/admin/dashboard">🔧 Admin Dashboard</a>
          <a href="/admin/orders">📊 Admin Orders</a>
          <a href="/">🏠 Home</a>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
          <h4>📝 Testing Instructions:</h4>
          <ol>
            <li>Click "Order Preview" to see your cart and apply coupon "SAVE10"</li>
            <li>Complete the order with any email address</li>
            <li>Use "My Orders" to lookup your order history</li>
            <li>Use Admin pages to manage order status</li>
          </ol>
        </div>
      </body>
    </html>
  `);
});

module.exports = router;
