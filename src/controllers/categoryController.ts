import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CategoryRequest {
  name: string;
  color: string;
}

export const getAllCategories = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const categories = await prisma.category.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryById = async (
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
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await prisma.category.findFirst({
      where: {
        id,
        user_id: userId,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCategory = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { name, color } = req.body;

    // Check if category name already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        user_id: userId,
      },
    });

    if (existingCategory) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        color,
        user_id: userId,
      },
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const id = parseInt(req.params.id);
    const { name, color } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if new name conflicts with existing category (if name is being changed)
    if (name && name !== existingCategory.name) {
      const nameConflict = await prisma.category.findFirst({
        where: {
          name,
          user_id: userId,
          NOT: { id },
        },
      });

      if (nameConflict) {
        return res.status(400).json({ error: "Category name already exists" });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        color: color || existingCategory.color,
      },
    });

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (
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
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if category has tasks
    const tasksCount = await prisma.task.count({
      where: { category_id: id },
    });

    if (tasksCount > 0) {
      return res.status(400).json({
        error:
          "Cannot delete category with associated tasks. Please reassign or delete the tasks first.",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
