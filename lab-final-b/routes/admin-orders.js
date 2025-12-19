const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");

// List all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render("lab-final-b/admin/orders", {
      title: "Manage Orders",
      orders,
      message: req.query.message || null,
      messageType: req.query.type || "success",
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    res.status(500).send("Error loading orders");
  }
});

// Update order status with strict validation
router.post("/order/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.redirect("/admin/orders?message=Order not found&type=error");
    }

    const currentStatus = order.status;

    // Strict status transition validation
    const validTransitions = {
      Placed: ["Processing"],
      Processing: ["Delivered"],
      Delivered: [], // Cannot transition from Delivered
      Cancelled: [], // Cannot transition from Cancelled
    };

    // Check if the transition is valid
    if (!validTransitions[currentStatus]) {
      return res.redirect(
        `/admin/orders?message=Invalid current status&type=error`
      );
    }

    if (!validTransitions[currentStatus].includes(status)) {
      let errorMessage = "";
      if (currentStatus === "Placed") {
        errorMessage =
          'Orders with status "Placed" can only move to "Processing"';
      } else if (currentStatus === "Processing") {
        errorMessage =
          'Orders with status "Processing" can only move to "Delivered"';
      } else if (currentStatus === "Delivered") {
        errorMessage = 'Orders that are "Delivered" cannot be changed';
      } else if (currentStatus === "Cancelled") {
        errorMessage = 'Orders that are "Cancelled" cannot be changed';
      } else {
        errorMessage = `Invalid status transition from "${currentStatus}" to "${status}"`;
      }

      return res.redirect(
        `/admin/orders?message=${encodeURIComponent(errorMessage)}&type=error`
      );
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.redirect(
      `/admin/orders?message=Order status updated successfully to ${status}&type=success`
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    res.redirect(
      "/admin/orders?message=Error updating order status&type=error"
    );
  }
});

module.exports = router;

