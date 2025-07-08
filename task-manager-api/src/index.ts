import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Test route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Task Manager API!" });
});

// Get all tasks
app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// Get a single task by ID
app.get("/tasks/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = await prisma.task.findUnique({ where: { id } });
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Create a new task
app.post("/tasks", async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const newTask = await prisma.task.create({
    data: { title, description },
  });
  res.status(201).json(newTask);
});

// Update a task
app.put("/tasks/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, completed } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, completed },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
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
