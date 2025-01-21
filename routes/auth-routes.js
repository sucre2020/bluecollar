const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user-model");
const Handyman = require("../models/Handyman"); // Import handyman model

// Middleware to check if a user is authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Save the requested URL for redirect after login
  const redirectUrl = req.originalUrl || "/dashboard";
  res.redirect(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
}

// Register route
router.get("/register", (req, res) => {
  res.render("register", { user: req.user || null }); // Pass user to view
});

router.post("/register", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    await newUser.save();
    res.redirect("/auth/login");
  } catch (error) {
    res.redirect("/auth/register");
  }
});

// Login route
router.get("/login", (req, res) => {
  res.render("login", { user: req.user || null }); // Pass user to view
});

// Handle login form submission
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/dashboard", // Redirect to dashboard on success
//     failureRedirect: "/auth/login", // Redirect back to login on failure
//   })
// );

// Handle login form submission with redirect support
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/auth/login?error=Invalid credentials");

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Redirect to the original URL or default to dashboard
      const redirectTo = req.query.redirect || "/dashboard";
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle the error
    }
    res.redirect("/auth/login"); // Redirect to login page after logout
  });
});

// Register handyman route (ensure user is signed in)
router.get("/register-handyman", ensureAuth, (req, res) => {
  res.render("register-handyman", { user: req.user || null }); // Pass user to view
});

router.post("/register-handyman", ensureAuth, async (req, res) => {
  const { name, state, lga, area, dailyPay, phoneNumber, emailAddress } =
    req.body;

  try {
    const newHandyman = new Handyman({
      name,
      state,
      lga,
      area,
      dailyPay,
      phoneNumber,
      emailAddress,
    });
    await newHandyman.save();
    res.redirect("/handymen"); // Redirect to handymen list after registration
  } catch (error) {
    res.status(500).send("Error registering handyman");
  }
});

module.exports = router;
