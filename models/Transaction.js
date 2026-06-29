// ============================================================
// FILE: backend/models/Transaction.js
// OWNER: Member 2 (Backend Dev)
// RESPONSIBILITY: Mongoose schema & model for transactions
// ============================================================

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // Clerk user ID — links transaction to the authenticated user
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be positive"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries by userId + date
transactionSchema.index({ userId: 1, date: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;