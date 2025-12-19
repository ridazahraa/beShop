/**
 * Discount Middleware
 * Handles coupon code validation and discount calculation
 */

const applyDiscount = (req, res, next) => {
  // Get coupon code from body or query
  const couponCode = (req.body.coupon || req.query.coupon || "")
    .trim()
    .toUpperCase();

  // Get cart from session
  const cart = req.session.cart || [];

  // Calculate original total
  let originalTotal = 0;
  cart.forEach((item) => {
    originalTotal += item.price * item.quantity;
  });

  // Initialize discount values
  let discountAmount = 0;
  let finalTotal = originalTotal;
  let couponApplied = false;
  let couponError = "";

  // Check if coupon is SAVE10
  if (couponCode) {
    if (couponCode === "SAVE10") {
      // Calculate 10% discount
      discountAmount = originalTotal * 0.1;
      finalTotal = originalTotal - discountAmount;
      couponApplied = true;
    } else {
      // Invalid coupon code
      couponError = "Invalid coupon code";
    }
  }

  // Store values in res.locals for views and next handlers
  res.locals.originalTotal = originalTotal;
  res.locals.discountAmount = discountAmount;
  res.locals.finalTotal = finalTotal;
  res.locals.couponApplied = couponApplied;
  res.locals.couponCode = couponCode;
  res.locals.couponError = couponError;

  next();
};

module.exports = applyDiscount;

