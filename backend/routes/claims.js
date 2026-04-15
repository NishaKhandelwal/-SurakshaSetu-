const express = require("express");
const router = express.Router();

const Claim = require("../models/Claim");

// 🔥 IMPORTANT: use updated function name
const { autoCreateAndProcessClaims } = require("../controllers/claimController");
const { processClaim } = require("../controllers/claimController");
const auth = require("../middleware/authMiddleware");

router.post("/claim", auth, processClaim);



// ==========================
// GET /api/claims/:userId
// ==========================
router.get("/:userId", async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.params.userId })
      .populate("policyId");

    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================
// POST /api/claims/trigger
// ==========================
router.post("/trigger", async (req, res) => {
  try {
    const { rain = 0, temp = 0, aqi = 0 } = req.body;

    const claims = await autoCreateAndProcessClaims({ rain, temp, aqi });

    res.json({
      message: `${claims.length} claim(s) processed using ML`,
      claims
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ONLY ONE EXPORT
module.exports = router;