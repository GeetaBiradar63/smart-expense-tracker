import React, { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="centerAuth">
      <div className="authCard">
        <div style={{ fontSize: 48, marginBottom: 10 }}>💳</div>
        <div className="authTitle">Welcome Back</div>
        <div className="authSmall">Sign in to manage your finances</div>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <input
            className="input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" type="submit">
            Sign In
          </button>
        </form>

        <div style={{ marginTop: 18, color: "#aab4c6", fontSize: 13 }}>
          Don't have an account?{" "}
          <Link style={{ color: "#8b5cf6", fontWeight: 800 }} to="/register">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
