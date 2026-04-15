const express = require("express");
const router = express.Router();

const {
  createPolicy,
  getPolicies,
  getPolicyById,
  deletePolicy
} = require("../controllers/policyController");

const auth = require("../middleware/authMiddleware");

router.post("/create", auth, createPolicy);
router.get("/", auth, getPolicies);
router.get("/:id", auth, getPolicyById);
router.delete("/:id", auth, deletePolicy);

module.exports = router;