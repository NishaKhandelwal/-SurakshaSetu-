const Policy = require("../models/policy");

// ==========================
// CREATE POLICY
// ==========================
exports.createPolicy = async (req, res) => {
  try {
    const { type, city, basePremium } = req.body;

    // Logged-in user (from JWT middleware)
    const userId = req.user.id;

    // Dummy premium logic (can upgrade later)
    const weatherRisk = 200;
    const cityRisk = 100;
    const discount = 50;

    const totalPremium =
      Number(basePremium) + weatherRisk + cityRisk - discount;

    const policy = await Policy.create({
      userId,
      type,
      city,
      basePremium,
      weatherRisk,
      cityRisk,
      discount,
      totalPremium
    });

    res.status(201).json({
      message: "Policy created successfully",
      policy
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// ==========================
// GET ALL POLICIES (for logged-in user)
// ==========================
exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: policies.length,
      policies
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// ==========================
// GET SINGLE POLICY
// ==========================
exports.getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found"
      });
    }

    res.status(200).json(policy);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// ==========================
// DELETE POLICY (optional but pro-level)
// ==========================
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found"
      });
    }

    res.status(200).json({
      message: "Policy deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};