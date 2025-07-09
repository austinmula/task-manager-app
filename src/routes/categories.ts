import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { authenticateToken } from "../middleware/auth";
import { validateCategory } from "../middleware/validation";

const router = Router();

// Apply authentication middleware to all category routes
router.use(authenticateToken);

// Category routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", validateCategory, createCategory);
router.put("/:id", validateCategory, updateCategory);
router.delete("/:id", deleteCategory);

export default router;
