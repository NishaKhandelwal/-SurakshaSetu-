import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [isProtected, setIsProtected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName] = useState(localStorage.getItem("userName") || "Partner");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const activateInsights = () => {
    setIsLoading(true);
    // Simulating AI Oracle Processing
    setTimeout(() => {
      setIsProtected(true);
      setIsLoading(false);
    }, 800);
  };

  if (isLoading) return <div className="loading-screen">🧠 Synchronizing Income Oracle...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-brand">🛡️ Suraksha<span>Setu</span></div>
        <div className="nav-right">
          <span className="user-badge">Hello, {userName}</span>
          <button onClick={handleLogout} className="logout-link">Sign Out</button>
        </div>
      </nav>

      {/* ⚡ REAL-TIME ALERT SYSTEM */}
      <div className="alert-banner-top">
        <span className="blink">🚨</span> 
        <strong>Severe Rain Expected in 2 Hours:</strong> 
        <span className="cta-text" onClick={activateInsights}>Activate protection now to secure today's earnings.</span>
      </div>

      <div className="dashboard-content">
        <header className="hero">
          <div className="hero-text">
            <h1>Protect Your Income, Not Just Your Ride.</h1>
            <p>AI-driven risk intelligence for the modern delivery workforce.</p>
          </div>
          <button onClick={activateInsights} className="btn-secondary">
            {isProtected ? "Refresh Risk Insights" : "View Risk Insights"}
          </button>
        </header>

        <div className="main-grid">
          {/* --- LEFT COLUMN --- */}
          <div className="grid-column">
            
            {/* 🔥 RISK INTELLIGENCE */}
            <section className="card risk-intel">
              <div className="card-header">
                <h3>Risk Intelligence</h3>
                <span className="live-tag">LIVE AI</span>
              </div>
              <div className="risk-score-container">
                <div className="score-main">
                  <span className="score-val">12%</span>
                  <span className="score-label">Low Risk Today</span>
                </div>
                <div className="risk-breakdown">
                  <div className="risk-bar"><span>🌧 Rain Risk</span> <div className="progress"><div className="fill" style={{width: '5%'}}></div></div> <span>5%</span></div>
                  <div className="risk-bar"><span>🌡 Heat Risk</span> <div className="progress"><div className="fill" style={{width: '3%'}}></div></div> <span>3%</span></div>
                  <div className="risk-bar"><span>🌫 Pollution</span> <div className="progress"><div className="fill" style={{width: '4%'}}></div></div> <span>4%</span></div>
                </div>
              </div>
            </section>

            {/* ⚡ INCOME RISK / EXPECTED LOSS */}
            <section className="card income-prediction">
              <h3>💸 Income Risk Prediction</h3>
              <div className="income-stats">
                <div className="stat"><span>Expected Earnings</span> <strong>₹1200</strong></div>
                <div className="stat"><span>Risk Adjusted</span> <strong className="success-text">₹950</strong></div>
                <div className="stat-highlight"><span>Potential Loss</span> <strong className="danger-text">₹250</strong></div>
              </div>
            </section>

            {/* 📊 RECENT INCOME SUPPORT */}
            <section className="card claims-card">
              <h3>Recent Income Support</h3>
              <div className="claims-list">
                <div className="claim-row">
                  <div className="claim-info"><strong>Rain Disruption</strong><span>April 2, 2026</span></div>
                  <div className="claim-payout"><span className="amt">+₹180</span></div>
                </div>
                <div className="claim-row">
                  <div className="claim-info"><strong>Extreme Heatwave</strong><span>March 28, 2026</span></div>
                  <div className="claim-payout"><span className="amt">+₹120</span></div>
                </div>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="grid-column">
            
            {/* 📍 ACTIVE PROTECTION CARD */}
            <section className={`card policy-card ${isProtected ? 'active-border' : ''}`}>
              <h3>Policy Status</h3>
              <div className="policy-details">
                <div className="p-row"><span>Status</span> <strong className={isProtected ? 'success-text' : 'danger-text'}>{isProtected ? 'ACTIVE' : 'INACTIVE'}</strong></div>
                <div className="p-row"><span>Weekly Premium</span> <strong>₹65</strong></div>
                <div className="p-row"><span>Coverage</span> <strong>Up to ₹200 / shift</strong></div>
              </div>
              {!isProtected && <button onClick={activateInsights} className="btn-primary">Activate Protection</button>}
            </section>

            {/* 🧠 INCOME ORACLE STATUS */}
            <section className="card oracle-card">
              <h3>🧠 Income Oracle Status</h3>
              <ul className="oracle-list">
                <li><span className="check">✅</span> Activity Verified</li>
                <li><span className="check">✅</span> Demand Drop Detected</li>
                <li><span className="check">⚡</span> Eligible for Protection</li>
              </ul>
            </section>

            {/* 🛡️ FRAUD DETECTION STATUS */}
            <section className="card fraud-card">
              <h3>🛡️ Trust Score / Fraud Check</h3>
              <div className="fraud-stats">
                <div className="trust-circle">
                    <div className="percentage">92%</div>
                </div>
                <div className="fraud-info">
                  <p><strong>Verified User</strong> ✅</p>
                  <p className="subtext">Risk Flag: None Detected</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;