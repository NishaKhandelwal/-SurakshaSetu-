const Claim = require("../models/Claim");
const Policy = require("../models/Policy");

const TRIGGERS = {
  Rain: 80,       // > 80mm
  Heat: 45,       // > 45°C
  Pollution: 400, // AQI > 400
};

async function autoCreateAndApproveClaims(weatherData) {
  const { rain, temp, aqi } = weatherData;

  const checks = [
    { type: "Rain", value: rain },
    { type: "Heat", value: temp },
    { type: "Pollution", value: aqi },
  ];

  const triggeredTypes = checks.filter(({ type, value }) => value > TRIGGERS[type]);

  if (triggeredTypes.length === 0) return [];

  // Fetch all policies
  const policies = await Policy.find({});

  const createdClaims = [];

  for (const policy of policies) {
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
        userId: policy.userId,
        policyId: policy._id,
        triggerType: type,
        triggerValue: value,
        status: "Approved", // Zero-touch auto-approve
      });

      createdClaims.push(claim);
    }
  }

  return createdClaims;
}

module.exports = { autoCreateAndApproveClaims, TRIGGERS };
