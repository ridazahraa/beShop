const express = require('express');
const router = express.Router();
const applyDiscount = require('../lab-final-b/middleware/discount');
const Order = require('../models/Order');

// Checkout page route
router.get('/', applyDiscount, (req, res) => {
    try {
        const cart = req.session.cart || [];
        
        // If cart is empty, redirect to cart page
        if (cart.length === 0) {
            return res.redirect('/cart');
        }

        // Get discount values from middleware
        const {
            originalTotal = 0,
            discountAmount = 0,
            finalTotal = 0,
            couponApplied = false,
            couponCode = '',
            couponError = '',
        } = res.locals;

        // Calculate delivery fee and tax
        const deliveryFee = 10.00;
        const tax = (parseFloat(finalTotal) * 0.05).toFixed(2); // 5% tax
        const grandTotal = (parseFloat(finalTotal) + deliveryFee + parseFloat(tax)).toFixed(2);

        res.render('checkout', { 
            title: 'BeShop - Checkout',
            cart: cart,
            originalTotal: originalTotal.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            subtotal: finalTotal.toFixed(2),
            deliveryFee: deliveryFee.toFixed(2),
            tax: tax,
            grandTotal: grandTotal,
            couponApplied: couponApplied,
            couponCode: couponCode,
            couponError: couponError,
        });
    } catch (error) {
        console.error('Error loading checkout:', error);
        res.status(500).send('Error loading checkout page');
    }
});

// Handle checkout form submission
router.post('/', applyDiscount, async (req, res) => {
    try {
        const { email, fullName, phone, address, city, postalCode, country, payment } = req.body;
        const cart = req.session.cart || [];

        // Validate cart
        if (cart.length === 0) {
            return res.redirect('/cart');
        }

        // Validate required fields
        if (!email || !fullName || !address) {
            return res.status(400).send('Required fields are missing');
        }

        // Get discounted total from middleware
        const { finalTotal } = res.locals;
        const deliveryFee = 10.00;
        const tax = finalTotal * 0.05;
        const grandTotal = finalTotal + deliveryFee + tax;

        // Prepare products array
        const products = cart.map((item) => {
            return {
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            };
        });

        // Create new order
        const newOrder = new Order({
            email: email.trim().toLowerCase(),
            products: products,
            totalAmount: grandTotal,
            status: "Placed",
        });

        // Save order to database
        await newOrder.save();

        // Clear cart from session
        req.session.cart = [];

        // Redirect to success page
        res.redirect('/order/success');
    } catch (error) {
        console.error('Error processing checkout:', error);
        res.status(500).send('Error processing order');
    }
});

module.exports = router;
