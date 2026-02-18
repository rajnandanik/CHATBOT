import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      /*localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);*/
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);

      navigate(res.data.role === "admin" ? "/admin" : "/chat");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div className="auth-card">
        <h2 className="auth-title">🔐 Login</h2>

        {error && (
          <p
            style={{
              marginBottom: "10px",
              padding: "8px 10px",
              borderRadius: "10px",
              textAlign: "center",
              color: "#fecaca",
              background: "rgba(239,68,68,.18)",
              border: "1px solid rgba(239,68,68,.35)",
            }}
          >
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "14px" }}
        />

        <button onClick={handleLogin} className="btn">
          Login
        </button>

        <p className="auth-help">
          Don’t have an account? <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
