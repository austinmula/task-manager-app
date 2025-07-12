import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import categoryRoutes from "./routes/categories";
import logger from "./utils/logger";
import { requestLogger, errorLogger } from "./middleware/logging";

const app = express();
const prisma = new PrismaClient();

// Enable CORS for all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Request logging middleware
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  logger.info("Health check endpoint accessed");
  res.json({
    message: "Task Manager API is running!",
    version: "1.0.0",
    status: "healthy",
  });
});

// Error logging middleware
app.use(errorLogger);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Successfully connected to the database");
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
