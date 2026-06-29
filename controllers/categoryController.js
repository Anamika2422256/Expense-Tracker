// ============================================================
// FILE: backend/controllers/categoryController.js
// OWNER: Member 2 (Backend Dev)
// RESPONSIBILITY: CRUD for user-defined categories
// ============================================================

import Category from "../models/Category.js"; // Note the explicit .js extension

const DEFAULT_CATEGORIES = [
  { name: "Salary", type: "income", icon: "💼", color: "#22c55e" },
  { name: "Freelance", type: "income", icon: "💻", color: "#10b981" },
  { name: "Investment", type: "income", icon: "📈", color: "#06b6d4" },
  { name: "Food & Dining", type: "expense", icon: "🍕", color: "#f97316" },
  { name: "Transport", type: "expense", icon: "🚗", color: "#8b5cf6" },
  { name: "Shopping", type: "expense", icon: "🛍️", color: "#ec4899" },
  { name: "Entertainment", type: "expense", icon: "🎮", color: "#f59e0b" },
  { name: "Healthcare", type: "expense", icon: "🏥", color: "#ef4444" },
  { name: "Utilities", type: "expense", icon: "⚡", color: "#6366f1" },
  { name: "Education", type: "expense", icon: "📚", color: "#14b8a6" },
];

export const getCategories = async (req, res) => {
  try {
    const userId = req.auth.userId;
    let categories = await Category.find({ userId });

    // Seed defaults if user has no categories
    if (categories.length === 0) {
      const seeded = DEFAULT_CATEGORIES.map((c) => ({ ...c, userId }));
      categories = await Category.insertMany(seeded);
    }

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const category = await Category.create({ ...req.body, userId });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Category name already exists" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await Category.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};