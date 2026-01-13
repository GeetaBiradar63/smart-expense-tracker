import React, { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registered successfully ✅ Now login!");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="centerAuth">
      <div className="authCard">
        <div style={{ fontSize: 48, marginBottom: 10 }}>🧾</div>
        <div className="authTitle">Create Account</div>
        <div className="authSmall">Start tracking your expenses</div>

        <form onSubmit={handleRegister} style={{ display: "grid", gap: 12 }}>
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="btn" type="submit">
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: 18, color: "#aab4c6", fontSize: 13 }}>
          Already have an account?{" "}
          <Link style={{ color: "#8b5cf6", fontWeight: 800 }} to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
