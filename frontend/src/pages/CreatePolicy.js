import React, { useState, useEffect } from "react";

const CreatePolicy = ({ onPolicyCreated }) => {
  const [premium, setPremium] = useState(65);
  const [coverage, setCoverage] = useState(200);
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Dynamic income calculation
  const [incomeData, setIncomeData] = useState({ expected: 1200, adjusted: 950, loss: 250 });

  useEffect(() => {
    const riskFactor = Math.min(coverage / 1000 + premium / 500, 0.3); // max 30% risk
    const expected = 1200;
    const adjusted = Math.round(expected * (1 - riskFactor));
    const loss = expected - adjusted;
    setIncomeData({ expected, adjusted, loss });
  }, [premium, coverage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!startDate) {
      setMessage({ type: "danger", text: "Please select a start date for your policy." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/policy/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          totalPremium: premium,
          coveragePerShift: coverage,
          startDate
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "✅ Policy created successfully!" });
        onPolicyCreated();
      } else {
        setMessage({ type: "danger", text: data.message || "Failed to create policy" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Something went wrong!" });
    }
    setLoading(false);
  };

  return (
    <div className="card create-policy-card">
      <h3>🛡️ Create Your SurakshaSetu Policy</h3>
      <p>This AI-powered policy protects your income from weather, heat, and pollution disruptions.</p>

      {/* Policy Overview */}
      <div className="policy-overview">
        <h4>📄 Policy Overview</h4>
        <ul>
          <li>Valid for delivery partners working ≥15 hours/week</li>
          <li>Automatic payouts for Rain &gt 80mm, Temp &gt 45°C, AQI &gt 400</li>
          <li>Weekly Premium: ₹40–₹100 depending on risk</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Weekly Premium (₹):
          <input
            type="number"
            value={premium}
            onChange={(e) => setPremium(parseInt(e.target.value))}
            min="40"
            max="100"
            required
          />
        </label>

        <label>
          Coverage per Shift (₹):
          <input
            type="number"
            value={coverage}
            onChange={(e) => setCoverage(parseInt(e.target.value))}
            min="50"
            max="2000"
            required
          />
        </label>

        <label>
          Policy Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        {/* Dynamic Risk / Earnings Preview */}
        <div className="income-stats-preview">
          <h4>💸 Predicted Earnings / Loss</h4>
          <div className="income-stats">
            <div className="stat"><span>Expected Earnings</span> <strong>₹{incomeData.expected}</strong></div>
            <div className="stat"><span>Risk Adjusted</span> <strong className="success-text">₹{incomeData.adjusted}</strong></div>
            <div className="stat-highlight"><span>Potential Loss</span> <strong className="danger-text">₹{incomeData.loss}</strong></div>
          </div>
          <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
            Preview updates as you adjust premium and coverage.
          </p>
        </div>

        {message && (
          <p className={message.type === "success" ? "success-text" : "danger-text"}>{message.text}</p>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Policy"}
        </button>
      </form>

      {/* Parametric Triggers & Info */}
      <div className="policy-triggers">
        <h4>⚡ Parametric Triggers</h4>
        <ul>
          <li>Heavy Rain: Rainfall &gt; 80mm</li>
          <li>Extreme Rain: Rainfall &gt; 120mm</li>
          <li>Heatwave: Temperature &gt; 45°C</li>
          <li>Pollution: AQI &gt; 400</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePolicy;