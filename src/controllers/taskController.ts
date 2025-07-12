import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { TaskRequest, TaskQueryParams } from "../types";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export const getAllTasks = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    logger.debug(`Fetching tasks for user ID: ${userId}`);

    const {
      page = "1",
      limit = "10",
      status,
      category_id,
      search,
      sort = "created_at",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      user_id: userId,
    };

    if (status) {
      where.status = status;
    }

    if (category_id) {
      where.category_id = parseInt(category_id as string);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sort === "due_date") {
      orderBy.due_date = "asc";
    } else if (sort === "title") {
      orderBy.title = "asc";
    } else {
      orderBy.created_at = "desc";
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip: offset,
        take: limitNum,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    logger.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskById = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        user_id: userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
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
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { title, description, due_date, status, category_id } = req.body;
    logger.info(`Creating task: "${title}" for user ID: ${userId}`);

    // Validate category belongs to user if provided
    if (category_id) {
      const category = await prisma.category.findFirst({
        where: {
          id: category_id,
          user_id: userId,
        },
      });

      if (!category) {
        return res.status(400).json({ error: "Invalid category" });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        due_date: due_date ? new Date(due_date) : null,
        status: status || "pending",
        category_id: category_id || null,
        user_id: userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    logger.info(`Task created successfully: "${task.title}" (ID: ${task.id})`);
    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    logger.error("Create task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const id = parseInt(req.params.id);
    const { title, description, due_date, status, category_id } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Validate category belongs to user if provided
    if (category_id !== undefined) {
      if (category_id !== null) {
        const category = await prisma.category.findFirst({
          where: {
            id: category_id,
            user_id: userId,
          },
        });

        if (!category) {
          return res.status(400).json({ error: "Invalid category" });
        }
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingTask.title,
        description:
          description !== undefined ? description : existingTask.description,
        due_date:
          due_date !== undefined
            ? due_date
              ? new Date(due_date)
              : null
            : existingTask.due_date,
        status: status !== undefined ? status : existingTask.status,
        category_id:
          category_id !== undefined ? category_id : existingTask.category_id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
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

export const deleteTask = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        user_id: userId,
      },
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
