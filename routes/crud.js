const express = require('express');
const router = express.Router();

// CRUD page route
router.get('/', (req, res) => {
    res.render('crud', { 
        title: 'BeShop - CRUD'
    });
});

module.exports = router;
