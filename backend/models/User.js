const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  city: String,
  platform: String,
  avgWeeklyIncome: Number,
  workingHours: Number
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);