// ============================================================
// FILE: backend/routes/transactionRoutes.js
// OWNER: Member 2 (Backend Dev)
// RESPONSIBILITY: Route definitions for transaction CRUD
// ============================================================

import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(requireAuth); // All routes below are protected

router.route("/").get(getTransactions).post(createTransaction);
router.route("/:id").put(updateTransaction).delete(deleteTransaction);

export default router;