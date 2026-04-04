const Claim = require("../models/Claim");
const Policy = require("../models/Policy");
const User = require("../models/User");

const TRIGGERS = {
  Rain: 80,       // > 80mm
  Heat: 45,       // > 45°C
  Pollution: 400, // AQI > 400
};

/**
 * Auto-create and approve claims based on weather triggers + income loss
 * @param {Object} weatherData - { rain, temp, aqi }
 */
async function autoCreateAndApproveClaims(weatherData) {
  const { rain = 0, temp = 0, aqi = 0 } = weatherData;

  const checks = [
    { type: "Rain", value: rain },
    { type: "Heat", value: temp },
    { type: "Pollution", value: aqi },
  ];

  const triggeredTypes = checks.filter(({ type, value }) => value > TRIGGERS[type]);
  if (triggeredTypes.length === 0) return [];

  // Fetch all policies with user data
  const policies = await Policy.find({}).populate("userId");
  const createdClaims = [];

  for (const policy of policies) {
    const user = policy.userId;
    if (!user) continue;

    // Simulate income loss for the week
    const expectedIncome = user.avgWeeklyIncome || 0;
    const actualIncome = expectedIncome - 500;  // example: ₹500 loss
    const payout = (expectedIncome - actualIncome) * 0.3; // 30% coverage

    for (const { type, value } of triggeredTypes) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Avoid duplicate claims for same policy + trigger on same day
      const existing = await Claim.findOne({
        policyId: policy._id,
        triggerType: type,
        createdAt: { $gte: today },
      });
      if (existing) continue;

      const claim = await Claim.create({
        userId: user._id,
        policyId: policy._id,
        triggerType: type,
        triggerValue: value,
        status: "Approved",
        expectedIncome,
        actualIncome,
        payout
      });

      createdClaims.push(claim);
    }
  }

  return createdClaims;
}

module.exports = { autoCreateAndApproveClaims, TRIGGERS };