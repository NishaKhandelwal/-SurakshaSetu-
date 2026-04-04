const express = require("express");
const User = require("../models/User");

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

    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // optional: check hashed password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;