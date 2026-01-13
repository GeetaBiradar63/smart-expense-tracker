import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [note, setNote] = useState("");

  const fetchExpense = async () => {
    try {
      const res = await API.get("/expenses");
      const exp = (res.data || []).find((e) => e._id === id);

      if (!exp) {
        alert("Expense not found");
        navigate("/expenses");
        return;
      }

      setAmount(exp.amount);
      setDate(exp.date ? exp.date.split("T")[0] : "");
      setCategory(exp.category);
      setPaymentMethod(exp.paymentMethod || "UPI");
      setNote(exp.title || "");
    } catch (err) {
      alert("Failed to load expense");
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const updateExpense = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/expenses/${id}`, {
        title: note,
        amount,
        category,
        paymentMethod,
        date,
      });

      alert("✅ Expense updated");
      navigate("/expenses");
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <div className="headerRow">
        <div className="pageTitle">Edit Expense</div>
      </div>

      <div className="panel" style={{ maxWidth: 900, margin: "0 auto" }}>
        <form onSubmit={updateExpense} style={{ display: "grid", gap: 14 }}>
          <div>
            <div className="cardTitle">Amount (₹)</div>
            <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div className="formGrid">
            <div>
              <div className="cardTitle">Date</div>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
            <div className="cardTitle">Note</div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
            <button className="btn" type="submit">Update Expense</button>
            <button className="btnSecondary" type="button" onClick={() => navigate("/expenses")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
