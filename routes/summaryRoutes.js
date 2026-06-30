

import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  getSummary,
  getMonthlyBreakdown,
  getCategoryBreakdown,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getSummary);
router.get("/monthly", getMonthlyBreakdown);
router.get("/by-category", getCategoryBreakdown);

export default router;
