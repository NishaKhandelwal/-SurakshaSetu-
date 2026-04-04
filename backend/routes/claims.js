const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const { autoCreateAndApproveClaims } = require("../services/claimService");

// GET /api/claims/:userId — fetch claims for a user
router.get("/:userId", async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.params.userId }).populate("policyId");
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/claims/trigger — manually trigger claim check with weather data
// Body: { rain, temp, aqi }
router.post("/trigger", async (req, res) => {
  try {
    const { rain = 0, temp = 0, aqi = 0 } = req.body;
    const claims = await autoCreateAndApproveClaims({ rain, temp, aqi });
    res.json({ message: `${claims.length} claim(s) auto-created and approved.`, claims });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
