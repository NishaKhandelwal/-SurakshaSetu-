import React, { useState, useEffect } from "react";
import CreatePolicy from "../pages/CreatePolicy";
import Claims from "../pages/Claims";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Partner");
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [incomeData, setIncomeData] = useState({ expected: 1200, adjusted: 950, loss: 250 });
  const [loading, setLoading] = useState(false);

  // Dummy Risk Intelligence
  const [riskData, setRiskData] = useState({ total: 12, rain: 5, heat: 3, pollution: 4 });

  // Dummy Income Oracle
  const incomeOracle = { activityVerified: true, demandDrop: true, eligible: true };

  // Dummy Fraud Status
  const fraudStatus = { trustScore: 92, status: "Verified User", riskFlag: null };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fetchPolicy = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/policy/", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      const data = await res.json();
      if (data.count > 0) setPolicy(data.policies[0]);
    } catch (err) { console.error(err); }
  };

  const fetchClaims = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`http://localhost:5000/api/claims/${userId}`);
      const data = await res.json();
      setClaims(data);
    } catch (err) { console.error(err); }
  };

  const triggerClaims = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/claims/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rain: 100, temp: 35, aqi: 300 })
      });
      const data = await res.json();
      alert(`${data.claims.length} claim(s) created!`);
      fetchClaims();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => {
    fetchPolicy();
    fetchClaims();
  }, []);

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🛡️ SurakshaSetu</h2>
        <nav>
          <ul>
            <li className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>Home</li>
            <li className={activeTab === "claims" ? "active" : ""} onClick={() => setActiveTab("claims")}>Claims</li>
            <li className={activeTab === "create" ? "active" : ""} onClick={() => setActiveTab("create")}>Create Policy</li>
          </ul>
        </nav>
        <button className="logout-link" onClick={handleLogout}>Sign Out</button>
      </div>

      {/* Main content */}
      <div className="dashboard-main">
        {loading && <div className="loading-screen">🧠 Processing Claims...</div>}

        {activeTab === "home" && (
          <>
            <div className="hero">
              <h1>Protect Your Income, Not Just Your Ride.</h1>
              <p>Real-time risk insights and income protection for delivery partners.</p>
            </div>

            {/* Alerts */}
            <div className="alert-banner-top">
              🚨 Severe Rain Expected in 2 Hours — Activate Protection Now
            </div>

            <div className="main-grid">

              {/* Risk Intelligence */}
              <div className="card">
                <h3>🔥 Risk Intelligence</h3>
                <div className="risk-bar">
                  <span>Total Risk</span>
                  <div className="progress">
                    <div className="fill" style={{ width: `${riskData.total}%` }}></div>
                  </div>
                  <strong>{riskData.total}%</strong>
                </div>
                <p>Breakdown:</p>
                <ul className="oracle-list">
                  <li>🌧 Rain Risk: {riskData.rain}%</li>
                  <li>🌡 Heat Risk: {riskData.heat}%</li>
                  <li>🌫 Pollution Risk: {riskData.pollution}%</li>
                </ul>
              </div>

              {/* Income Risk */}
              <div className="card">
                <h3>💸 Income Risk / Expected Loss</h3>
                <div className="income-stats">
                  <div className="stat"><span>Expected Earnings</span> <strong>₹{incomeData.expected}</strong></div>
                  <div className="stat"><span>Risk Adjusted</span> <strong className="success-text">₹{incomeData.adjusted}</strong></div>
                  <div className="stat-highlight"><span>Potential Loss</span> <strong className="danger-text">₹{incomeData.loss}</strong></div>
                </div>
              </div>

              {/* Income Oracle */}
              <div className="card">
                <h3>🧠 Income Oracle Status</h3>
                <ul className="oracle-list">
                  <li>Activity Verified: {incomeOracle.activityVerified ? "✅" : "❌"}</li>
                  <li>Demand Drop Detected: {incomeOracle.demandDrop ? "✅" : "❌"}</li>
                  <li>Eligible for Protection: {incomeOracle.eligible ? "⚡" : "❌"}</li>
                </ul>
              </div>

              {/* Fraud Detection */}
              <div className="card fraud-card">
                <h3>🛡️ Trust / Fraud Check</h3>
                <ul className="oracle-list">
                  <li>Trust Score: {fraudStatus.trustScore}%</li>
                  <li>Status: {fraudStatus.status}</li>
                  <li>Risk Flag: {fraudStatus.riskFlag || "None"}</li>
                </ul>
              </div>

              {/* Policy Status */}
              <div className="card policy-card">
                <h3>🛡️ Policy Status</h3>
                {policy ? (
                  <div className="policy-details">
                    <div className="p-row">
                      <span>Status</span>
                      <strong className={policy.totalPremium > 0 ? "success-text" : "danger-text"}>
                        {policy.totalPremium > 0 ? "ACTIVE" : "INACTIVE"}
                      </strong>
                    </div>
                    <div className="p-row"><span>Weekly Premium</span> <strong>₹{policy.totalPremium || 65}</strong></div>
                    <div className="p-row"><span>Coverage</span> <strong>Up to ₹200 / shift</strong></div>
                    <button className="btn-primary" onClick={triggerClaims}>Trigger Claims</button>
                  </div>
                ) : <p>No active policy. Create one to start protection.</p>}
              </div>
            </div>

            {/* Recent Income / Claims */}
            <div className="card claims-card">
              <h3>📊 Recent Income Support / Payouts</h3>
              {claims.length === 0 && (
                <ul className="oracle-list">
                  <li>₹180 payout (Rain disruption)</li>
                  <li>₹120 payout (Heatwave)</li>
                </ul>
              )}
              {claims.length > 0 && claims.map(claim => (
                <div key={claim._id} className="claim-row">
                  <div className="claim-info">
                    <strong>{claim.triggerType} Trigger</strong> <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="claim-payout"><span className="amt">+₹{claim.payout || 0}</span></div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "claims" && <Claims userId={localStorage.getItem("userId")} />}
        {activeTab === "create" && <CreatePolicy onPolicyCreated={fetchPolicy} />}
      </div>
    </div>
  );
};

export default Dashboard;