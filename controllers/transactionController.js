

import Transaction from "../models/Transaction.js"; // Note the explicit .js extension

// @desc    Get all transactions for logged-in user (with filters)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const userId = req.auth.userId; // From Clerk middleware
    const { type, category, startDate, endDate, search, page = 1, limit = 20 } = req.query;

    // Build dynamic filter
    const filter = { userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { type, amount, category, description, date, tags } = req.body;

    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      category,
      description,
      date: date || new Date(),
      tags,
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId }, // Ensure user owns this transaction
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get summary stats (balance, total income, total expense)
// @route   GET /api/summary
// @access  Private
export const getSummary = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const result = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    let income = 0, expense = 0, incomeCount = 0, expenseCount = 0;
    result.forEach((r) => {
      if (r._id === "income") { income = r.total; incomeCount = r.count; }
      if (r._id === "expense") { expense = r.total; expenseCount = r.count; }
    });

    res.json({
      success: true,
      data: {
        balance: income - expense,
        totalIncome: income,
        totalExpense: expense,
        incomeCount,
        expenseCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly breakdown for charts
// @route   GET /api/summary/monthly
// @access  Private
export const getMonthlyBreakdown = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const data = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get expense breakdown by category (for pie chart)
// @route   GET /api/summary/by-category
// @access  Private
export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const data = await Transaction.aggregate([
      { $match: { userId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
