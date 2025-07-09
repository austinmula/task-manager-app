import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
} from "../controllers/authController";
import { validateRegister, validateLogin } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Auth routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

export default router;
