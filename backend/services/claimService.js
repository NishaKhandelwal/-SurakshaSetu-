const { getExpectedIncome, checkFraud } = require("../services/mlService");

async function autoCreateAndProcessClaims(weatherData) {
  const { rain, temp, aqi } = weatherData;

  const TRIGGERS = {
    Rain: 80,
    Heat: 45,
    Pollution: 400,
  };

  const checks = [
    { type: "Rain", value: rain },
    { type: "Heat", value: temp },
    { type: "Pollution", value: aqi },
  ];

  const triggeredTypes = checks.filter(({ type, value }) => value > TRIGGERS[type]);

  if (triggeredTypes.length === 0) return [];

  const policies = await Policy.find({});
  const createdClaims = [];

  for (const policy of policies) {
    for (const { type, value } of triggeredTypes) {

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existing = await Claim.findOne({
        policyId: policy._id,
        triggerType: type,
        createdAt: { $gte: today },
      });

      if (existing) continue;

      // 🔥 MOCK user data (replace later with real data)
      const userData = {
        past_income: 500,
        hours: 5,
        rainfall: rain,
        temp: temp,
        aqi: aqi,
        time_of_day: new Date().getHours(),
        speed: 30,
        route_variance: 0.2,
        order_rate: 0.8,
        session_time: 120
      };

      const actualIncome = 400; // simulate

      // 🔥 ML CALLS
      const expectedIncome = await getExpectedIncome(userData);
      const fraud = await checkFraud(userData);

      let status = "Approved";
      let payout = 0;

      if (fraud) {
        status = "Flagged";
      } else {
        const loss = Math.max(0, expectedIncome - actualIncome);
        payout = loss * 0.35;
      }

      const claim = await Claim.create({
        userId: policy.userId,
        policyId: policy._id,
        triggerType: type,
        triggerValue: value,
        expectedIncome,
        actualIncome,
        payout,
        fraud,
        status
      });

      createdClaims.push(claim);
    }
  }

  return createdClaims;
}

module.exports = { autoCreateAndProcessClaims };