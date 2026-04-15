import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [isProtected, setIsProtected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName] = useState(localStorage.getItem("userName") || "Partner");

  const [income, setIncome] = useState(null);
  const [fraudScore, setFraudScore] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const activateInsights = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsProtected(true);
      setIsLoading(false);
    }, 800);
  };

  // 🔥 FETCH ML + WEATHER DATA
  useEffect(() => {
    fetchIncome();
    fetchFraud();
    fetchWeather();
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await fetch("http://localhost:5001/predict-income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoursWorked: 6,
          completedOrders: 12,
          avgOrderValue: 100,
          rain: 80,
          temp: 30,
          aqi: 120
        })
      });

      const data = await res.json();
      setIncome(data.expectedIncome);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFraud = async () => {
    try {
      const res = await fetch("http://localhost:5001/detect-fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distance: 10,
          speed: 5,
          completedOrders: 2
        })
      });

      const data = await res.json();
      setFraudScore(data.fraudScore);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/weather/Delhi");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error(err);
    }
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

      {/* 🌧️ REAL WEATHER ALERT */}
      {weather && (
        <div className="alert-banner-top">
          🚨 Rain: {weather.rain}mm | Temp: {weather.temp}°C | AQI: {weather.aqi}
        </div>
      )}

      <div className="dashboard-content">
        <header className="hero">
          <h1>Protect Your Income, Not Just Your Ride.</h1>
          <p>AI-driven risk intelligence for gig workers.</p>

          <button onClick={activateInsights} className="btn-secondary">
            {isProtected ? "Refresh Risk Insights" : "View Risk Insights"}
          </button>
        </header>

        <div className="main-grid">

          {/* LEFT */}
          <div className="grid-column">

            {/* 📊 RISK */}
            <section className="card">
              <h3>Risk Intelligence</h3>
              <div className="score-main">
                <span className="score-val">
                  {weather ? Math.min(weather.rain + weather.aqi / 10, 100) : "..." }%
                </span>
                <span className="score-label">Dynamic Risk</span>
              </div>
            </section>

            {/* 💸 INCOME */}
            <section className="card">
              <h3>💸 Income Prediction (ML)</h3>
              <div className="income-stats">
                <div className="stat">
                  <span>Expected</span>
                  <strong>₹{income || "..."}</strong>
                </div>

                <div className="stat">
                  <span>Adjusted</span>
                  <strong className="success-text">
                    ₹{income ? Math.round(income * 0.8) : "..."}
                  </strong>
                </div>

                <div className="stat-highlight">
                  <span>Loss</span>
                  <strong className="danger-text">
                    ₹{income ? Math.round(income * 0.2) : "..."}
                  </strong>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT */}
          <div className="grid-column">

            {/* POLICY */}
            <section className={`card ${isProtected ? 'active-border' : ''}`}>
              <h3>Policy Status</h3>
              <p>Status: <strong>{isProtected ? "ACTIVE" : "INACTIVE"}</strong></p>

              {!isProtected && (
                <button onClick={activateInsights} className="btn-primary">
                  Activate Protection
                </button>
              )}
            </section>

            {/* FRAUD */}
            <section className="card">
              <h3>🛡️ Fraud Detection</h3>

              <div className="trust-circle">
                {fraudScore
                  ? Math.round((1 - fraudScore) * 100) + "%"
                  : "..."}
              </div>

              <p>
                {fraudScore < 0.5
                  ? "✅ Genuine User"
                  : "⚠️ Suspicious Activity"}
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;