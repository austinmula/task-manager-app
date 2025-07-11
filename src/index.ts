import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import categoryRoutes from "./routes/categories";

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Task Manager API is running!",
    version: "1.0.0",
    status: "healthy",
  });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
