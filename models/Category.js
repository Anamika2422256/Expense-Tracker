// ============================================================
// FILE: backend/models/Category.js
// OWNER: Member 2 (Backend Dev)
// RESPONSIBILITY: Mongoose schema & model for custom categories
// ============================================================

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense", "both"],
      default: "both",
    },
    icon: {
      type: String,
      default: "💰",
    },
    color: {
      type: String,
      default: "#6366f1",
    },
  },
  { timestamps: true }
);

// Prevent duplicate category names per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;