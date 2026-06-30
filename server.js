
// 1. Force Node.js to use Google DNS to bypass ISP/System SRV blockages
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "dotenv/config"; // 🚀 This immediately loads your .env variables before any other imports execute!

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import morgan from "morgan";

// Local imports (Safe now because environment variables are loaded)
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";

const app = express();

// Connect to MongoDB
connectDB();
 
// ── Middleware ──────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
 
// Clerk auth middleware
app.use(clerkMiddleware());
 
// ── Health Check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running 🚀" });
});
 
// ── Routes ──────────────────────────────────────────────────
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/summary", summaryRoutes);
 
// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
 
// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
