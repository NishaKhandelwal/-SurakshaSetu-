const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  policyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Policy", 
    required: true 
  },

  triggerType: { 
    type: String, 
    enum: ["Rain", "Heat", "Pollution"] 
  },

  triggerValue: { 
    type: Number 
  },

  // 🔥 ML OUTPUTS
  expectedIncome: {
    type: Number,
    default: 0
  },

  actualIncome: {
    type: Number,
    default: 0
  },

  payout: {
    type: Number,
    default: 0
  },

  fraud: {
    type: Boolean,
    default: false
  },

  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Flagged"], 
    default: "Pending" 
  }

}, { timestamps: true }); // auto adds createdAt & updatedAt

module.exports = mongoose.model("Claim", claimSchema);