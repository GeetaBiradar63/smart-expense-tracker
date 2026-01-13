import React, { useEffect, useMemo, useState } from "react";
import API from "../api";
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#8b5cf6", "#22c55e", "#f97316", "#ef4444", "#3b82f6"];

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load analytics. Please login again.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Use current month only for analytics
  const now = new Date();

  const thisMonthExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
  }, [expenses]);

  // ✅ Total current month
  const total = useMemo(() => {
    return thisMonthExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [thisMonthExpenses]);

  // ✅ Category percentage split (REAL, no random)
  const pieData = useMemo(() => {
    if (total === 0) return [];

    const byCategory = {};
    thisMonthExpenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
    });

    return Object.keys(byCategory).map((cat) => ({
      name: cat,
      value: Math.round((byCategory[cat] / total) * 100),
    }));
  }, [thisMonthExpenses, total]);

  // ✅ Daily spending bar chart
  const barData = useMemo(() => {
    if (thisMonthExpenses.length === 0) return [];

    const byDay = {};
    thisMonthExpenses.forEach((e) => {
      const d = new Date(e.date);
      const day = String(d.getDate()).padStart(2, "0");
      const label = `${day} ${d.toLocaleString("default", { month: "short" })}`;

      byDay[label] = (byDay[label] || 0) + Number(e.amount || 0);
    });

    return Object.entries(byDay).map(([date, amount]) => ({
      date,
      amount,
    }));
  }, [thisMonthExpenses]);

  return (
    <div>
      <div className="headerRow">
        <div className="pageTitle">Analytics</div>
      </div>

      {thisMonthExpenses.length === 0 ? (
        <div className="panel">
          <h3>No expenses this month</h3>
          <p>Add expenses to see analytics.</p>
        </div>
      ) : (
        <div className="analyticsGrid">
          <div className="panel">
            <div className="cardTitle">Category Splitting (This Month)</div>

            <PieChart width={420} height={320}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="panel">
            <div className="cardTitle">Daily Spending (This Month)</div>

            <BarChart width={520} height={320} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
}
