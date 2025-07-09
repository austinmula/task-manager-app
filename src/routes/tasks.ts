import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { authenticateToken } from "../middleware/auth";
import { validateTask } from "../middleware/validation";

const router = Router();

// Apply authentication middleware to all task routes
router.use(authenticateToken);

// Task routes
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", validateTask, createTask);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);

export default router;
