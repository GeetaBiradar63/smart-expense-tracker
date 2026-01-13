const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, date, paymentMethod } = req.body;

    // ✅ validation
    if (!amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exp = await Expense.create({
      userId: req.user.id,
      title: title || "",
      amount,
      category,
      paymentMethod: paymentMethod || "UPI",
      date,
    });

    res.status(201).json({ message: "✅ Expense added", exp });
  } catch (err) {
    res.status(500).json({ message: "Expense create error", error: err.message });
  }
});

// ✅ Get all expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Expense fetch error", error: err.message });
  }
});

// ✅ Update expense (EDIT)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, date, paymentMethod } = req.body;

    const exp = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title,
        amount,
        category,
        date,
        paymentMethod,
      },
      { new: true }
    );

    if (!exp) return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "✅ Expense updated", exp });
  } catch (err) {
    res.status(500).json({ message: "Expense update error", error: err.message });
  }
});

// ✅ Delete expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const exp = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!exp) return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "✅ Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Expense delete error", error: err.message });
  }
});

// ✅ Export CSV
router.get("/export/csv", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });

    let csv = "Date,Category,Payment,Title,Amount\n";
    expenses.forEach((e) => {
      csv += `${new Date(e.date).toISOString().split("T")[0]},${e.category},${e.paymentMethod || ""},${(e.title || "").replace(/,/g, " ")},${e.amount}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");

    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Export error", error: err.message });
  }
});

module.exports = router;
