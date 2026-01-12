import React, { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  async function register() {
    await api.post("/api/auth/register", { name, email, password });
    alert("✅ Registered. Now login.");
    setIsLogin(true);
  }

  async function login() {
    const res = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    alert("✅ Login success");
  }

  async function fetchExpenses() {
    if (!token) return;
    const res = await api.get("/api/expenses", { headers });
    setExpenses(res.data);
  }

  async function addExpense() {
    if (!title || !amount) return alert("Enter title and amount");
    await api.post(
      "/api/expenses",
      { title, amount: Number(amount), category: "General" },
      { headers }
    );
    setTitle("");
    setAmount("");
    fetchExpenses();
  }

  async function deleteExpense(id) {
    await api.delete(`/api/expenses/${id}`, { headers });
    fetchExpenses();
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setExpenses([]);
  }

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>💰 Smart Expense Tracker</h2>

      {!token ? (
        <div style={{ border: "1px solid #ccc", padding: 15, width: 320 }}>
          {isLogin ? <h3>Login</h3> : <h3>Register</h3>}

          {!isLogin && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />

          {isLogin ? (
            <button onClick={login} style={{ width: "100%" }}>
              Login
            </button>
          ) : (
            <button onClick={register} style={{ width: "100%" }}>
              Register
            </button>
          )}

          <p style={{ marginTop: 10 }}>
            {isLogin ? "No account?" : "Already have account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>

          <h3>Add Expense</h3>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={addExpense}>Add</button>

          <h3>Expenses</h3>
          {expenses.length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            <ul>
              {expenses.map((e) => (
                <li key={e._id}>
                  {e.title} - ₹{e.amount}{" "}
                  <button onClick={() => deleteExpense(e._id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
