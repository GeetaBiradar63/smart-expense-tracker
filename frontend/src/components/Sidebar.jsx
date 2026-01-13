import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebar" style={{ position: "relative" }}>
      <div className="brand">
        <div className="brandLogo">💳</div>
        <div>Smart Spend</div>
      </div>

      <div className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? "active" : "")}>
          Add Expense
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => (isActive ? "active" : "")}>
          Expenses
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active" : "")}>
          Analytics
        </NavLink>

        <button
          className="btnSecondary"
          style={{ marginTop: 14, width: "100%", color: "#ff4d4f" }}
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="sidebarFooter">
        Signed in as <b>Demo User</b>
      </div>
    </div>
  );
}
