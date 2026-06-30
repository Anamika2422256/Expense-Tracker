
import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoryController.js";

const router = express.Router();

//router.use(requireAuth);
router.route("/").get(getCategories).post(createCategory);
router.route("/:id").delete(deleteCategory);

export default router;
