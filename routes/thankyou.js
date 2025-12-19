const express = require('express');
const router = express.Router();

// Thank you page route
router.get('/', (req, res) => {
    res.render('thankyou', { 
        title: 'BeShop - Thank You'
    });
});

module.exports = router;
