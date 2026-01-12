const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const exp = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date,
    });

    res.status(201).json({ message: "✅ Expense added", exp });
  } catch (err) {
    res.status(500).json({ message: "Expense create error", error: err.message });
  }
});

// Get all expenses of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Expense fetch error", error: err.message });
  }
});

// Delete expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const exp = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!exp) return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "✅ Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Expense delete error", error: err.message });
  }
});

module.exports = router;
