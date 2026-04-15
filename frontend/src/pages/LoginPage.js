import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
    const url = `http://localhost:5000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? {
                email: formData.email,
                password: formData.password
              }
            : {
                name: formData.name,
                email: formData.email,
                password: formData.password
              }
        )
      });

      const data = await response.json();

      if (response.ok) {
        // Save token
        localStorage.setItem("token", data.token);

        // Save user info
        const userName =
          data.name ||
          (data.user && data.user.name) ||
          formData.name ||
          "Partner";

        const userId =
          (data.user && data.user._id) || data._id || "";

        localStorage.setItem("userName", userName);
        localStorage.setItem("userId", userId);

        // Redirect
        window.location.href = "/dashboard";
      } else {
        setError(
          data.error ||
          data.message ||
          "Authentication failed. Please try again."
        );
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* HEADER */}
        <div className="auth-header">
          <h1>SurakshaSetu</h1>
          <p>
            {isLogin
              ? "Welcome back, partner!"
              : "Join the protection hub."}
          </p>
        </div>

        {/* ERROR */}
        {error && <div className="auth-error">⚠️ {error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="auth-form">

          {/* NAME (only for register) */}
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : isLogin
              ? "Login to Dashboard"
              : "Create Account"}
          </button>
        </form>

        {/* TOGGLE LOGIN/REGISTER */}
        <div className="auth-footer">
          <p>
            {isLogin
              ? "Don't have an account? "
              : "Already have an account? "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="auth-toggle"
            >
              {isLogin ? "Register here" : "Login here"}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;