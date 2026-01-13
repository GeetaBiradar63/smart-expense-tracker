import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [note, setNote] = useState("");

  const navigate = useNavigate();

  const addExpense = async (e) => {
    e.preventDefault();

    try {
      await API.post("/expenses", {
        title: note || category,
        amount: Number(amount),
        category,
        paymentMethod,
        date,
      });

      alert("Expense added ✅");
      navigate("/expenses");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <div className="headerRow">
        <div className="pageTitle">Add New Expense</div>
      </div>

      <div className="panel" style={{ maxWidth: 900, margin: "0 auto" }}>
        <form onSubmit={addExpense} style={{ display: "grid", gap: 14 }}>
          <div>
            <div className="cardTitle">Amount (₹)</div>
            <input
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="formGrid">
            <div>
              <div className="cardTitle">Date</div>
              <input
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="cardTitle">Category</div>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Food</option>
                <option>Shopping</option>
                <option>Travel</option>
                <option>Bills</option>
              </select>
            </div>
          </div>

          <div>
            <div className="cardTitle">Payment Method</div>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>UPI</option>
              <option>Card</option>
              <option>Cash</option>
            </select>
          </div>

          <div>
            <div className="cardTitle">Note (Optional)</div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
            <button className="btn" type="submit">Add Expense</button>

            <button className="btnSecondary" type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
