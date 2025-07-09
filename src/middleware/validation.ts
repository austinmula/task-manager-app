import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

export const validateRegister = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

export const validateTask = [
  body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
  body("description").optional().trim(),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
  handleValidationErrors,
];
