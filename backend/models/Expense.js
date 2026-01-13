const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "" },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, default: "UPI" },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
