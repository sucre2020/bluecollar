const express = require("express");
const router = express.Router();
const Handyman = require("../models/Handyman");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const upload = require("../middleware/multerConfig");

// Middleware to protect routes
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

// Route: Add handyman (GET)
router.get("/handymen/add", ensureAuth, (req, res) => {
  res.render("add-handyman", { errors: [], user: req.user });
});

// Route: Add handyman (POST)
router.post("/handymen/add", ensureAuth, async (req, res) => {
  const { name, location, dailyPay, phoneNumber, emailAddress, image, skill } =
    req.body;
  let errors = [];

  if (!name) {
    errors.push({ msg: "Please enter name" });
  }
  if (!skill) {
    errors.push({ msg: "Please enter skill/handwork" });
  }

  if (errors.length > 0) {
    res.render("add-handyman", { errors, user: req.user });
  } else {
    try {
      const newHandyman = new Handyman({
        userId: req.user.id,
        name,
        location,
        dailyPay,
        phoneNumber,
        emailAddress,
        image,
        skill,
      });

      await newHandyman.save();
      res.redirect("/handymen");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
});

// Route: View all handymen (GET)
router.get("/handymen", async (req, res) => {
  // removed ensureAuth to enable users can view handymen regardless if logged in or not,
  try {
    // const handymen = await Handyman.find({ userId: req.user.id });// commented out this line so all handymen are displayed when called regardless of who created them
    const handymen = await Handyman.find();
    res.render("view-handymen", { handymen, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Route: List all handymen (admin-level or public view)
router.get("/handymen/all", ensureAuth, async (req, res) => {
  try {
    const handymen = await Handyman.find();
    res.render("handymen", { handymen, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Route: Get handyman by ID (GET)
router.get("/handymen/:id", ensureAuth, async (req, res) => {
  try {
    const handyman = await Handyman.findById(req.params.id);
    if (!handyman) {
      return res.status(404).send("Handyman not found");
    }
    res.render("handyman-details", { handyman, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Route: Handyman Signup Page (GET)
router.get("/handyman/signup", ensureAuth, (req, res) => {
  res.render("handyman-signup", { errors: [], user: req.user });
});

// Route: Handle Signup (POST)
router.post(
  "/handyman/signup",
  ensureAuth,
  upload.single("image"),
  async (req, res) => {
    const { name, location, dailyPay, phoneNumber, emailAddress, skill } =
      req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ""; // Save file path
    let errors = [];

    // Validate fields
    if (!name) errors.push({ msg: "Name is required" });
    if (!location) errors.push({ msg: "Location is required" });
    if (!dailyPay) errors.push({ msg: "Daily pay is required" });
    if (!phoneNumber) errors.push({ msg: "Phone number is required" });
    if (!emailAddress) errors.push({ msg: "Email address is required" });
    if (!skill) errors.push({ msg: "Skill is required" });

    if (errors.length > 0) {
      return res.render("handyman-signup", { errors, user: req.user });
    }

    try {
      // Get the Cloudinary URL from the uploaded file
      const imageUrl = req.file ? req.file.path : "";

      const newHandyman = new Handyman({
        name,
        location,
        dailyPay,
        phoneNumber,
        emailAddress,
        skill,
        image: imageUrl, //Save Cloudinary image url
      });

      await newHandyman.save();
      res.redirect("/handymen");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
