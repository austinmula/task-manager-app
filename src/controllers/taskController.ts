import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest, TaskRequest } from "../types";

const prisma = new PrismaClient();

export const getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createTask = async (
  req: AuthenticatedRequest<{}, {}, TaskRequest>,
  res: Response
) => {
  try {
    const { title, description } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (
  req: AuthenticatedRequest<{}, {}, TaskRequest>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, completed } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingTask.title,
        description:
          description !== undefined ? description : existingTask.description,
        completed: completed !== undefined ? completed : existingTask.completed,
      },
    });

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
