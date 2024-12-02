const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");
// Route handlers
const authRoutes = require("./routes/auth-routes");
const dashboardRoutes = require("./routes/dashboard-routes");
const adminRoutes = require("./routes/admin-routes");
const userRoutes = require("./routes/users");
const handymenRoutes = require("./routes/handymen");
const aboutUsPage = require("./routes/aboutUs");

// Initialize app
const app = express();

// Passport configuration
require("./config/passport");

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set static files directory
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Session middleware
app.use(
  session({
    secret: process.env.cookieKey,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// Use routes
app.use("/auth", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", adminRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);
app.use("/", handymenRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/", aboutUsPage);

// Connect to MongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yoczwia.mongodb.net/sangisang?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(uri, {})
  .then(() => {
    console.log("Connected to MongoDB Successfully!");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
