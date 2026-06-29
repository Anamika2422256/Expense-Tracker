// ============================================================
// FILE: backend/routes/aiRoutes.js
// OWNER: Member 2 (Backend Dev)
// ============================================================

import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { getAIAdvice } from "../controllers/aiController.js";

const router = express.Router();

router.use(requireAuth);
router.post("/advice", getAIAdvice);

export default router;