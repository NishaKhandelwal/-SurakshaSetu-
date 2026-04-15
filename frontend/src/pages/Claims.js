import React, { useEffect, useState } from "react";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClaims = async () => {
    try {
      const userId = localStorage.getItem("userId");

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
      const res = await fetch("http://localhost:5000/api/claims/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          actualIncome: 800,
          userData: {
            hoursWorked: 6,
            completedOrders: 10,
            avgOrderValue: 120,
            rain: 100,
            temp: 32,
            aqi: 150,
            distance: 30,
            speed: 25,
          },
        }),
      });

      const data = await res.json();

      alert(`
✅ Claim Processed

Expected: ₹${data.expectedIncome}
Actual: ₹${data.actualIncome}
Payout: ₹${data.payout}
Status: ${data.status}
      `);

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

      <button className="btn-primary" onClick={triggerClaim} disabled={loading}>
        {loading ? "Processing..." : "Trigger Claim"}
      </button>

      <div style={{ marginTop: "1rem" }}>
        {claims.length === 0 ? (
          <p>No claims yet</p>
        ) : (
          claims.map((claim) => (
            <div key={claim._id} className="claim-row">
              <div>
                <strong>{claim.triggerType}</strong> <br />
                <small>{new Date(claim.createdAt).toLocaleDateString()}</small>
              </div>

              <div className="amt">
                +₹{claim.triggerValue}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Claims;