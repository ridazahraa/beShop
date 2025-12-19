const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");

// View Cart - GET /cart
router.get("/", (req, res) => {
  try {
    const cart = req.session.cart || [];
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });

    res.render("lab-final-b/cart", {
      title: "BeShop - Shopping Cart",
      cart: cart,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error("Error loading cart:", error);
    res.status(500).send("Error loading cart");
  }
});

// Add to Cart - POST /cart/add
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity) || 1;

    // Validate productId
    if (!productId) {
      return res.status(400).json({ success: false, error: "Product ID is required" });
    }

    // Get product from database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Check if product already in cart
    const existingItemIndex = req.session.cart.findIndex(
      (item) => item.productId && item.productId.toString() === productId.toString()
    );

    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      req.session.cart[existingItemIndex].quantity += qty;
    } else {
      // Add new item to cart
      req.session.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
      });
    }

    const cartCount = req.session.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    res.json({
      success: true,
      message: "Product added to cart",
      cartCount: cartCount,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, error: "Error adding product to cart: " + error.message });
  }
});

// Update Cart Item Quantity - POST /cart/update
router.post("/update", (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity);

    if (!productId || !qty || qty < 1) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const cart = req.session.cart || [];
    const itemIndex = cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    cart[itemIndex].quantity = qty;
    req.session.cart = cart;

    // Calculate new total
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });

    res.json({
      success: true,
      total: total.toFixed(2),
      itemTotal: (cart[itemIndex].price * qty).toFixed(2),
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Error updating cart" });
  }
});

// Remove from Cart - POST /cart/remove
router.post("/remove", (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cart = req.session.cart || [];
    req.session.cart = cart.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    // Calculate new total
    let total = 0;
    req.session.cart.forEach((item) => {
      total += item.price * item.quantity;
    });

    res.json({
      success: true,
      message: "Item removed from cart",
      total: total.toFixed(2),
      cartCount: req.session.cart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Error removing item from cart" });
  }
});

// Clear Cart - POST /cart/clear
router.post("/clear", (req, res) => {
  req.session.cart = [];
  res.json({ success: true, message: "Cart cleared" });
});

module.exports = router;

