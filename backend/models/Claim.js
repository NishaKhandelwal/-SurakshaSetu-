const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
  triggerType: { type: String, enum: ["Rain", "Heat", "Pollution"], required: true },
  triggerValue: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Claim", claimSchema);
