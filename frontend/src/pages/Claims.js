import React, { useEffect, useState } from "react";

const Claims = ({ userId }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClaims = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/claims/${userId}`);
      const data = await res.json();
      setClaims(data);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/claims/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rain: 100, temp: 35, aqi: 300, userId }),
      });
      const data = await res.json();
      alert(`${data.claims.length} claim(s) triggered!`);
      fetchClaims();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div className="claims-card card">
      <h3>📊 Your Claims / Payouts</h3>
      <p>Claims are automatically triggered by weather, heat, or pollution disruptions. You can also trigger manually for testing.</p>

      <button className="btn-primary" onClick={triggerClaim} disabled={loading}>
        {loading ? "Processing..." : "Trigger Claim"}
      </button>

      <div style={{ marginTop: "1rem" }}>
        {claims.length === 0 ? (
          <ul className="oracle-list">
            <li>₹180 payout (Rain disruption)</li>
            <li>₹120 payout (Heatwave)</li>
          </ul>
        ) : (
          claims.map((claim) => (
            <div key={claim._id} className="claim-row">
              <div>
                <strong>{claim.triggerType} Trigger</strong> <br />
                <small>{new Date(claim.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="amt">+₹{claim.payout || 0}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Claims;