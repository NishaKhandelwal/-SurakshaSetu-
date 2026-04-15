import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            ? { email: formData.email, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password }
        ),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        // Fallback name if backend doesn't send it or user name is empty
        const userName = data.name || (data.user && data.user.name) || formData.name || "[your_name_here]";
        localStorage.setItem("userName", userName);
        window.location.href = "/dashboard";
      } else {
        setError(data.error || data.message || "Authentication failed. Please try again.");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>SurakshaSetu</h1>
          <p>{isLogin ? "Welcome back, partner!" : "Join the protection hub."}</p>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                // Removed specific placeholder example
                placeholder="Enter your full name" 
                value={formData.name} 
                onChange={handleChange} 
                required={!isLogin} 
              />
            </div>
          )}
          
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

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : isLogin ? "Login to Dashboard" : "Create Account"}
            {isLoading ? "Processing..." : (isLogin ? "Login to Dashboard" : "Create Account")}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="auth-toggle"
            >
            <span onClick={() => { setIsLogin(!isLogin); setError(""); }} className="auth-toggle">
              {isLogin ? "Register here" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;