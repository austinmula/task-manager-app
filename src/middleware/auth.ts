import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../utils/auth";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export const authenticateToken = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    logger.warn("Authentication failed: No token provided");
    return res.status(401).json({ error: "Access token required" });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    logger.warn("Authentication failed: Invalid or expired token");
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      logger.warn(
        `Authentication failed: User not found for ID ${payload.userId}`
      );
      return res.status(403).json({ error: "User not found" });
    }

    logger.debug(`User authenticated: ${user.email} (ID: ${user.id})`);
    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
