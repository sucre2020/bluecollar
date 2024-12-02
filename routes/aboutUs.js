const express = require("express");
const router = express.Router();

router.get("/aboutUs", (req, res) => {
  res.render("view-aboutUs", { user: req.user || null });
});

module.exports = router;
