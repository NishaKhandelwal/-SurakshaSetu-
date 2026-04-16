const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs"); // optional, for password hashing

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, city, platform, avgWeeklyIncome, workingHours } = req.body;

    // optional: hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password, // or hashedPassword
      city,
      platform,
      avgWeeklyIncome,
      workingHours
    });

    const token = jwt.sign(
  { id: user._id },
  "secretkey",
  { expiresIn: "7d" }
);

res.json({
  success: true,
  token,
  user
});
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // (Optional later: password check)

    const token = jwt.sign(
      { id: user._id },
      "secretkey", // later move to .env
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;