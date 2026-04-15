const Claim = require("../models/Claim");
const Policy = require("../models/Policy");

const { getExpectedIncome, checkFraud } = require("../services/mlService");

// ==========================
// PROCESS MANUAL CLAIM
// ==========================
exports.processClaim = async (req, res) => {
    console.log("USER:", req.user);
    try {
        const { actualIncome, userData, policyId } = req.body;

        const expectedIncome = await getExpectedIncome(userData);
        const loss = Math.max(0, expectedIncome - actualIncome);

        const fraud = await checkFraud(userData);

        let status = "Approved";
        let payout = loss * 0.35;

        if (fraud) {
            status = "Flagged";
            payout = 0;
        }

        const claim = await Claim.create({
            userId: req.user.id,
            policyId,
            expectedIncome,
            actualIncome,
            payout,
            fraud,
            status
        });

        res.json(claim);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};


// ==========================
// AUTO CLAIMS (TRIGGERS)
// ==========================
exports.autoCreateAndProcessClaims = async (weatherData) => {

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

    const triggered = checks.filter(c => c.value > TRIGGERS[c.type]);

    if (triggered.length === 0) return [];

    const policies = await Policy.find({});
    const createdClaims = [];

    for (const policy of policies) {

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

        const actualIncome = 400;

        const expectedIncome = await getExpectedIncome(userData);
        const fraud = await checkFraud(userData);

        let payout = 0;
        let status = "Approved";

        if (!fraud) {
            const loss = Math.max(0, expectedIncome - actualIncome);
            payout = loss * 0.35;
        } else {
            status = "Flagged";
        }

        const claim = await Claim.create({
            userId: policy.userId,
            policyId: policy._id,
            expectedIncome,
            actualIncome,
            payout,
            fraud,
            status
        });

        createdClaims.push(claim);
    }

    return createdClaims;
};
