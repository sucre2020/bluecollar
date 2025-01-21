const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Seller = require("../models/Handymen");
// const Order = require("../models/Order");
const User = require("../models/user-model");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const ensureAdmin = require("../middleware/ensureAuthenticated");
const Handyman = require("../models/Handyman");

// Admin route to view and manage sellers, users, and orders
router.get("/dashboard", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const handymen = await Handyman.find();
    const users = await User.find();
    const orders = await Order.find()
      .populate("handyman")
      .populate("user")
      .populate("handyman") // Populate the handyman
      .populate("user"); // Populate the user
    res.render("admin-dashboard", { handymen, users, orders, user: req.user }); // pass req.user to the view
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Route to add a new user
router.post("/add-user", ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await newUser.save();
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Error adding user");
  }
});

// Route to edit a user
router.post(
  "/edit-user/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send("User not found");

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      user.name = name;
      user.email = email;
      user.isAdmin = isAdmin;
      await user.save();
      res.redirect("/admin/dashboard");
    } catch (err) {
      res.status(500).send("Error editing user");
    }
  }
);

// Route to delete a user
router.post(
  "/delete-user/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/admin/dashboard");
    } catch (err) {
      res.status(500).send("Error deleting user");
    }
  }
);

// Route to add a new seller
// GET route to render the 'Add Seller' form
router.get("/add-handyman", ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render("admin-add-handyman", { user: req.user });
});

// POST route to handle form submission and add a new seller
router.post(
  "/add-handyman",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    const {
      name,
      dailyPay,
      state,
      lga,
      area,
      rating,
      emailAddress,
      phoneNumber,
    } = req.body;

    try {
      const newHandyman = new Handyman({
        name,
        dailyPay,
        state,
        lga,
        area,
        rating,
        emailAddress,
        phoneNumber,
      });

      await newHandyman.save();
      res.redirect("/admin/dashboard"); // Redirect to the admin dashboard after adding a seller
    } catch (err) {
      console.error("Error adding handyman:", err);
      res.status(500).send("Error adding handyman");
    }
  }
);

// Route to edit a seller
router.post(
  "/edit-handyman/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    const { name, state, lga, area, dailyPay, phoneNumber, emailAddress } =
      req.body;
    try {
      const handyman = await Handyman.findById(req.params.id);
      if (!handyman) return res.status(404).send("Handyman not found");

      handyman.name = name;
      handyman.state = state;
      handyman.lga = lga;
      handyman.area = area;
      handyman.dailyPay = dailyPay;
      handyman.phoneNumber = phoneNumber;
      handyman.emailAddress = emailAddress;
      await handyman.save();
      res.redirect("/admin/dashboard");
    } catch (err) {
      res.status(500).send("Error editing handyman");
    }
  }
);

// Route to delete a seller
router.post(
  "/delete-handyman/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      await Handyman.findByIdAndDelete(req.params.id);
      res.redirect("/admin/dashboard");
    } catch (err) {
      res.status(500).send("Error deleting handyman");
    }
  }
);

module.exports = router;
