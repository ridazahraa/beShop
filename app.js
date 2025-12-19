const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use express-ejs-layouts
app.use(expressLayouts);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: "beshop-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Middleware to set layout for admin routes
app.use("/admin", (req, res, next) => {
  app.set("layout", "admin/layout");
  next();
});

// Middleware to set default layout for other routes
app.use((req, res, next) => {
  if (!req.url.startsWith("/admin")) {
    app.set("layout", false);
  }
  next();
});

// Import routes
const indexRoute = require("./routes/index");
const checkoutRoute = require("./routes/checkout");
const crudRoute = require("./routes/crud");
const thankyouRoute = require("./routes/thankyou");
const adminRoute = require("./routes/admin");

// Import lab-final-b routes
const labOrderRoute = require("./lab-final-b/routes/order");
const labAdminOrdersRoute = require("./lab-final-b/routes/admin-orders");
const labCartRoute = require("./lab-final-b/routes/cart");
const labCartApiRoute = require("./lab-final-b/routes/cart-api");

// Use routes
app.use("/", indexRoute);
app.use("/checkout", checkoutRoute);
app.use("/crud", crudRoute);
app.use("/thankyou", thankyouRoute);
app.use("/admin", adminRoute);
app.use("/order", labOrderRoute);
app.use("/admin", labAdminOrdersRoute);
app.use("/cart", labCartRoute);
app.use("/cart", labCartApiRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`BeShop server is running on http://localhost:${PORT}`);
});
