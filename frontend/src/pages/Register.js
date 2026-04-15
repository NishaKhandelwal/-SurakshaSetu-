import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    platform: "",
    avgWeeklyIncome: "",
    workingHours: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        // Save user info in localStorage
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("token", data.token); // JWT token

        // Optional: fetch policy if exists
        const policyRes = await fetch("http://localhost:5000/api/policy/", {
          headers: { Authorization: "Bearer " + data.token }
        });
        const policyData = await policyRes.json();
        if (policyData.count > 0) {
          localStorage.setItem("policyId", policyData.policies[0]._id);
        }

        alert("User registered successfully!");
        window.location.href = "/dashboard"; // redirect to dashboard

      } else {
        alert(data.error || "Error registering user");
      }

    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Make sure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Register Rider</h2>
      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
      />
      <input
        name="platform"
        placeholder="Platform (Swiggy/Zomato)"
        value={form.platform}
        onChange={handleChange}
      />
      <input
        name="avgWeeklyIncome"
        type="number"
        placeholder="Avg Weekly Income"
        value={form.avgWeeklyIncome}
        onChange={handleChange}
      />
      <input
        name="workingHours"
        type="number"
        placeholder="Working Hours per Day"
        value={form.workingHours}
        onChange={handleChange}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: "1rem", width: "100%", padding: "0.5rem" }}
      >
        {loading ? "Registering..." : "Register & Go to Dashboard"}
      </button>
    </div>
  );
}