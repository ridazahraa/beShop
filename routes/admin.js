const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");

// Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const forHerCount = await Product.countDocuments({ category: "for-her" });
    const forHimCount = await Product.countDocuments({ category: "for-him" });
    const onSaleCount = await Product.countDocuments({ onSale: true });
    const totalOrders = await Order.countDocuments();

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      totalProducts,
      forHerCount,
      forHimCount,
      onSaleCount,
      totalOrders,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

// List all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render("admin/products", {
      title: "Manage Products",
      products,
      message: req.query.message || null,
      messageType: req.query.type || "success",
    });
  } catch (error) {
    console.error("Error loading products:", error);
    res.status(500).send("Error loading products");
  }
});

// Show add product form
router.get("/products/add", (req, res) => {
  res.render("admin/add-product", {
    title: "Add New Product",
    message: null,
    messageType: "success",
  });
});

// Create new product
router.post("/products/add", async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price),
      image: req.body.image,
      onSale: req.body.onSale === "true",
      originalPrice: req.body.originalPrice
        ? parseFloat(req.body.originalPrice)
        : null,
    };

    const product = new Product(productData);
    await product.save();

    res.redirect(
      "/admin/products?message=Product added successfully&type=success"
    );
  } catch (error) {
    console.error("Error adding product:", error);
    res.render("admin/add-product", {
      title: "Add New Product",
      message: "Error adding product: " + error.message,
      messageType: "error",
    });
  }
});

// Show edit product form
router.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.redirect(
        "/admin/products?message=Product not found&type=error"
      );
    }

    res.render("admin/edit-product", {
      title: "Edit Product",
      product,
      message: null,
      messageType: "success",
    });
  } catch (error) {
    console.error("Error loading product:", error);
    res.redirect("/admin/products?message=Error loading product&type=error");
  }
});

// Update product
router.post("/products/edit/:id", async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price),
      image: req.body.image,
      onSale: req.body.onSale === "true",
      originalPrice: req.body.originalPrice
        ? parseFloat(req.body.originalPrice)
        : null,
    };

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect(
      "/admin/products?message=Product updated successfully&type=success"
    );
  } catch (error) {
    console.error("Error updating product:", error);
    res.redirect("/admin/products?message=Error updating product&type=error");
  }
});

// Delete product
router.post("/products/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect(
      "/admin/products?message=Product deleted successfully&type=success"
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    res.redirect("/admin/products?message=Error deleting product&type=error");
  }
});

module.exports = router;
