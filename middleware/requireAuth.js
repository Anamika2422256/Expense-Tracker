// ============================================================
// FILE: backend/middleware/requireAuth.js
// OWNER: Member 2 (Backend Dev)
// RESPONSIBILITY: Protect routes — reject unauthenticated requests
// ============================================================

import { requireAuth } from "@clerk/express";

// Use Clerk's built-in requireAuth middleware
// It reads the JWT from the Authorization header automatically
const authMiddleware = requireAuth();

export default authMiddleware;