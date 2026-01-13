import React, { useEffect, useMemo, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data || []);
    } catch (err) {
      alert("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const exportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/expenses/export/csv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("CSV export failed");
    }
  };

  const sorted = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  return (
    <div>
      <div className="headerRow">
        <div className="pageTitle">Expenses</div>
        <button className="btnSecondary" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      <div className="panel">
        {sorted.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Note</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((e) => (
                <tr key={e._id}>
                  <td>{new Date(e.date).toDateString()}</td>
                  <td>{e.category}</td>
                  <td>{e.paymentMethod || "-"}</td>
                  <td>{e.title || "-"}</td>
                  <td>₹{e.amount}</td>

                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btnSmall" onClick={() => navigate(`/edit/${e._id}`)}>
                      ✏️
                    </button>
                    <button className="btnSmallDanger" onClick={() => deleteExpense(e._id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
