const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  type: String,
  city: String,
  basePremium: Number,
  weatherRisk: Number,
  cityRisk: Number,
  discount: Number,
  totalPremium: Number
}, { timestamps: true });

module.exports = mongoose.model("Policy", policySchema);