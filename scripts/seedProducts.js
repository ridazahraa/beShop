const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://sp22bcs105_db_user:ynwKquHlq7l9Zh2F@cluster0.i838yup.mongodb.net/beshop?retryWrites=true&w=majority&appName=Cluster0';

// Sample products data
const products = [
    // For Her Products
    {
        name: 'Woo Album #1',
        price: 12.00,
        originalPrice: 15.00,
        category: 'for-her',
        image: '/images/ForHer1.jpg',
        description: 'Elegant fashion piece for her',
        onSale: true
    },
    {
        name: 'Woo Logo',
        price: 15.00,
        category: 'for-her',
        image: '/images/forHer2.jpg',
        description: 'Stylish design for modern women',
        onSale: false
    },
    {
        name: 'Woo Ninja',
        price: 35.00,
        category: 'for-her',
        image: '/images/forHer3.jpg',
        description: 'Premium quality fashion item',
        onSale: false
    },
    {
        name: 'Premium Quality',
        price: 35.00,
        category: 'for-her',
        image: '/images/forHer4.jpg',
        description: 'High-end fashion piece',
        onSale: false
    },
    {
        name: 'Flying Ninja',
        price: 25.00,
        category: 'for-her',
        image: '/images/forHer5.jpg',
        description: 'Trendy and comfortable',
        onSale: false
    },
    {
        name: 'Ship Your Idea',
        price: 30.00,
        category: 'for-her',
        image: '/images/forHer6.jpg',
        description: 'Creative fashion design',
        onSale: false
    },
    {
        name: 'Woo Logo Classic',
        price: 28.00,
        category: 'for-her',
        image: '/images/forHer7.jpg',
        description: 'Classic style for everyday wear',
        onSale: false
    },
    {
        name: 'Ninja Silhouette',
        price: 32.00,
        category: 'for-her',
        image: '/images/forHer8.jpg',
        description: 'Elegant silhouette design',
        onSale: false
    },
    
    // For Him Products
    {
        name: 'Woo Logo Men',
        price: 12.00,
        originalPrice: 15.00,
        category: 'for-him',
        image: '/images/forHim1.jpg',
        description: 'Stylish men\'s fashion',
        onSale: true
    },
    {
        name: 'Premium Quality Men',
        price: 15.00,
        category: 'for-him',
        image: '/images/forHim2.jpg',
        description: 'High quality men\'s wear',
        onSale: false
    },
    {
        name: 'Ship Your Idea Men',
        price: 35.00,
        category: 'for-him',
        image: '/images/forHim3.jpg',
        description: 'Modern men\'s fashion',
        onSale: false
    },
    {
        name: 'Ninja Silhouette Men',
        price: 35.00,
        category: 'for-him',
        image: '/images/forHim4.jpg',
        description: 'Bold design for men',
        onSale: false
    },
    {
        name: 'Woo Ninja Men',
        price: 25.00,
        category: 'for-him',
        image: '/images/forHim5.jpg',
        description: 'Comfortable and stylish',
        onSale: false
    },
    {
        name: 'Happy Ninja',
        price: 30.00,
        category: 'for-him',
        image: '/images/forHim6.jpg',
        description: 'Casual men\'s fashion',
        onSale: false
    },
    {
        name: 'Patient Ninja',
        price: 28.00,
        category: 'for-him',
        image: '/images/forHim7.jpg',
        description: 'Classic men\'s style',
        onSale: false
    },
    {
        name: 'Happy Ninja Pro',
        price: 32.00,
        category: 'for-him',
        image: '/images/forHim8.jpg',
        description: 'Professional men\'s wear',
        onSale: false
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Existing products cleared');

        // Insert sample products
        await Product.insertMany(products);
        console.log(`${products.length} products inserted successfully`);

        // Disconnect
        await mongoose.disconnect();
        console.log('Database seeding completed and disconnected');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
