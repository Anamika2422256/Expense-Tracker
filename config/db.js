// ============================================================
// FILE: backend/config/db.js
// OWNER: Member 1 (Project Lead)
// RESPONSIBILITY: MongoDB Atlas connection via Mongoose
// ============================================================

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;