// ============================================================
// FILE: backend/controllers/aiController.js
// OWNER: Member 2 (Backend Dev)
// RESPONSIBILITY: Gemini API integration for AI financial advice
// ============================================================

import axios from "axios";
import Transaction from "../models/Transaction.js"; // Note the explicit .js extension

// @desc    Generate AI financial summary using Gemini API
// @route   POST /api/ai/advice
// @access  Private
export const getAIAdvice = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Fetch user's last 30 transactions for context
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(30);

    // Build a summary for Gemini
    let totalIncome = 0, totalExpense = 0;
    const categoryMap = {};

    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      else {
        totalExpense += t.amount;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });

    const topCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
      .join(", ");

    const prompt = `
You are a friendly personal finance advisor. Based on the following financial data for a user, give a concise 3-4 sentence financial health summary with 2 specific, actionable tips.

Financial Data (last 30 transactions):
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpense.toFixed(2)}
- Net Balance: $${(totalIncome - totalExpense).toFixed(2)}
- Top Spending Categories: ${topCategories || "No expenses yet"}
- Savings Rate: ${totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%

Be encouraging but honest. Keep it under 120 words. Format: start with a brief assessment, then "💡 Tips:" followed by 2 numbered tips.
    `.trim();

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const geminiRes = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const aiText =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate advice at this time.";

    res.json({ success: true, advice: aiText });
  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "AI service temporarily unavailable.",
    });
  }
};