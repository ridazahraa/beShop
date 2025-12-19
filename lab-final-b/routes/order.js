const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const applyDiscount = require("../middleware/discount");

// Order Preview route - GET /order/preview
router.get("/preview", applyDiscount, (req, res) => {
  try {
    // Get cart from session
    const cart = req.session.cart || [];

    // If cart is empty, redirect to home
    if (cart.length === 0) {
      return res.redirect("/");
    }

    // Discount values are available from res.locals (set by middleware)
    const {
      originalTotal,
      discountAmount,
      finalTotal,
      couponApplied,
      couponCode,
      couponError,
    } = res.locals;

    res.render("lab-final-b/order-preview", {
      title: "BeShop - Order Preview",
      cart: cart,
      originalTotal: originalTotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      totalAmount: finalTotal.toFixed(2),
      couponApplied: couponApplied,
      couponCode: couponCode,
      couponError: couponError,
    });
  } catch (error) {
    console.error("Error loading order preview:", error);
    res.status(500).send("Error loading order preview");
  }
});

// Order Confirmation route - POST /order/confirm
router.post("/confirm", applyDiscount, async (req, res) => {
  try {
    const { email } = req.body;
    const cart = req.session.cart || [];

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).send("Email is required");
    }

    // Validate cart
    if (cart.length === 0) {
      return res.redirect("/");
    }

    // Get discounted total from middleware
    const { finalTotal } = res.locals;

    // Prepare products array
    const products = cart.map((item) => {
      return {
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      };
    });

    // Create new order with discounted total
    const newOrder = new Order({
      email: email.trim(),
      products: products,
      totalAmount: finalTotal, // Use discounted total from middleware
      status: "Placed",
    });

    // Save order to database
    await newOrder.save();

    // Clear cart from session
    req.session.cart = [];

    // Redirect to success page
    res.redirect("/order/success");
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).send("Error processing order");
  }
});

// Order Success route - GET /order/success
router.get("/success", async (req, res) => {
  try {
    // Get the most recent order for this session (if we stored order ID in session)
    // For now, just show success message
    res.render("lab-final-b/order-success", {
      title: "BeShop - Order Confirmed",
    });
  } catch (error) {
    console.error("Error loading success page:", error);
    res.status(500).send("Error loading success page");
  }
});

// My Orders - GET /my-orders
router.get("/my-orders", (req, res) => {
  res.render("lab-final-b/my-orders", {
    title: "BeShop - My Orders",
    orders: null,
    email: null,
    searched: false,
  });
});

// My Orders Lookup - POST /my-orders/lookup
router.post("/my-orders/lookup", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.trim()) {
      return res.render("lab-final-b/my-orders", {
        title: "BeShop - My Orders",
        orders: null,
        email: null,
        searched: false,
        error: "Please enter an email address",
      });
    }

    // Find all orders matching the email
    const orders = await Order.find({ email: email.trim().toLowerCase() }).sort(
      { createdAt: -1 }
    ); // Most recent first

    res.render("lab-final-b/my-orders", {
      title: "BeShop - My Orders",
      orders: orders,
      email: email.trim(),
      searched: true,
    });
  } catch (error) {
    console.error("Error looking up orders:", error);
    res.status(500).send("Error retrieving orders");
  }
});

// View Order Details - GET /order/details/:id
router.get("/details/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.render("lab-final-b/order-details", {
      title: "BeShop - Order Details",
      order: order,
    });
  } catch (error) {
    console.error("Error loading order details:", error);
    res.status(500).send("Error loading order details");
  }
});

module.exports = router;

