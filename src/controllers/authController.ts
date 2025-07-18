import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { LoginRequest, RegisterRequest, RefreshTokenRequest } from "../types";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  verifyRefreshToken,
} from "../utils/auth";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as RegisterRequest;
    logger.info(`Registration attempt for email: ${email}`);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.warn(`Registration failed: Email already registered - ${email}`);
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password and create user
    const password_hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password_hash, name },
      select: { id: true, email: true, name: true, created_at: true },
    });

    logger.info(`User registered successfully: ${email} (ID: ${user.id})`);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;
    logger.info(`Login attempt for email: ${email}`);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn(`Login failed: User not found - ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      logger.warn(`Login failed: Invalid password - ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    logger.info(`User logged in successfully: ${email} (ID: ${user.id})`);
    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as RefreshTokenRequest;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Check if refresh token exists in database and is not expired
    const tokenInDb = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(payload.userId);

    res.json({
      accessToken: newAccessToken,
      user: tokenInDb.user,
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as RefreshTokenRequest;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    // Delete refresh token from database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const me = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  res.json({
    user: req.user,
  });
};
