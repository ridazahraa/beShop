const express = require("express");
const router = express.Router();

// Get cart count - GET /cart/count
router.get("/count", (req, res) => {
  try {
    const cart = req.session.cart || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ count });
  } catch (error) {
    res.json({ count: 0 });
  }
});

module.exports = router;

