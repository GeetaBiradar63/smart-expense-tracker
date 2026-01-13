import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Current Month Filter
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // ✅ Today Filter
  const todayExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  });

  const totalThisMonth = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const spentToday = todayExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const transactions = currentMonthExpenses.length;

  // ✅ Top Category this month
  const categoryTotals = {};
  currentMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount || 0);
  });

  let topCategory = "None";
  let topCategoryAmount = 0;

  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCategoryAmount) {
      topCategory = cat;
      topCategoryAmount = amt;
    }
  });

  // ✅ Recent transactions (latest first)
  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      {/* Header row */}
      <div className="headerRow">
        <div>
          <div className="pageTitle">Dashboard</div>
          <div className="subTitle">Welcome back</div>
        </div>

        <button className="btn" onClick={() => navigate("/add")}>
          + Add New
        </button>
      </div>

      {/* Cards */}
      <div className="cardGrid">
        <div className="cardBox">
          <div className="cardTitle">Total This Month</div>
          <div className="cardValue">₹{totalThisMonth}</div>
          <div className="cardSub">Only current month expenses</div>
        </div>

        <div className="cardBox">
          <div className="cardTitle">Spent Today</div>
          <div className="cardValue">₹{spentToday}</div>
          <div className="cardSub">Today's total</div>
        </div>

        <div className="cardBox">
          <div className="cardTitle">Transactions</div>
          <div className="cardValue">{transactions}</div>
          <div className="cardSub">This month</div>
        </div>

        <div className="cardBox">
          <div className="cardTitle">Top Category</div>
          <div className="cardValue">{topCategory}</div>
          <div className="cardSub">Highest spending: ₹{topCategoryAmount}</div>
        </div>
      </div>

      {/* Recent transactions table */}
      <div className="panel">
        <div className="panelTitle">Recent Transactions</div>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Payment</th>
              <th>Note</th>
              <th style={{ textAlign: "right" }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {recentTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                  No expenses yet.
                </td>
              </tr>
            ) : (
              recentTransactions.map((e) => (
                <tr key={e._id}>
                  <td>{new Date(e.date).toDateString()}</td>
                  <td>{e.category}</td>
                  <td>{e.paymentMethod || "-"}</td>
                  <td>{e.title || "-"}</td>
                  <td style={{ textAlign: "right" }}>₹{e.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
