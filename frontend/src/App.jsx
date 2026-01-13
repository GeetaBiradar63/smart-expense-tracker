import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import EditExpense from "./pages/EditExpense"; // ✅ ADD THIS

function PrivateLayout({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="container">
      <Sidebar />
      <div className="main">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ App pages */}
        <Route
          path="/"
          element={
            <PrivateLayout>
              <Dashboard />
            </PrivateLayout>
          }
        />

        <Route
          path="/add"
          element={
            <PrivateLayout>
              <AddExpense />
            </PrivateLayout>
          }
        />

        <Route
          path="/expenses"
          element={
            <PrivateLayout>
              <Expenses />
            </PrivateLayout>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateLayout>
              <Analytics />
            </PrivateLayout>
          }
        />

        {/* ✅ NEW ROUTE FOR EDIT EXPENSE */}
        <Route
          path="/edit/:id"
          element={
            <PrivateLayout>
              <EditExpense />
            </PrivateLayout>
          }
        />

        {/* ✅ Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
