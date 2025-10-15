import { Request, Response } from "express";
import { CategoryModel } from "../../models/categoryModel.js";
import { pool } from "../../config/db.js";

export default class CategoryController {
  constructor() {}

  // ====================================
  // Get All Categories (with location filter)
  // ====================================

  public getAllCategories = async (req: Request, res: Response) => {
    try {
      const { location } = req.query;
      let categories;

      if (location && typeof location === "string" && location.trim()) {
        // Get distinct category IDs from cars in that location (case-insensitive)
        const carCategories = await pool.query(
          `SELECT DISTINCT category_id FROM cars WHERE location ILIKE $1;`,
          [`%${location.trim()}%`]
        );

        const categoryIds = carCategories.rows.map((c) => c.category_id);

        if (categoryIds.length === 0) {
          return res.status(200).json({ count: 0, categories: [] });
        }

        // Fetch all categories matching those IDs
        const result = await pool.query(
          `SELECT * FROM categories WHERE id = ANY($1::int[]);`,
          [categoryIds]
        );
        categories = result.rows;
      } else {
        const result = await pool.query(
          `SELECT * FROM categories ORDER BY name ASC;`
        );
        categories = result.rows;
      }

      return res.status(200).json({
        count: categories.length,
        categories,
      });
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // ====================================
  // Get Category by ID
  // ====================================
  public getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await CategoryModel.getById(Number(id));

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({ category });
    } catch (error: any) {
      console.error("Error fetching category by ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // ====================================
  // Add New Category
  // ====================================
  public addCategory = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const existing = await pool.query(
        `SELECT * FROM coupons WHERE code = $1`,
        [name.trim()]
      );

      console.log("existing", existing.rows.length);

      if (existing.rows.length > 0) {
        return res.status(409).json({ message: "Category already exists" });
      }

      const category = await CategoryModel.create({
        name: name.trim(),
        description,
      });

      return res.status(201).json({
        message: "Category created successfully",
        category,
      });
    } catch (error: any) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // ====================================
  // Update Category
  // ====================================
  public updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const updated = await CategoryModel.update(Number(id), {
        name,
        description,
      });

      if (!updated) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({
        message: "Category updated successfully",
        category: updated,
      });
    } catch (error: any) {
      console.error("Error updating category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // ====================================
  // Delete Category (check linked cars)
  // ====================================
  public deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const linked = await pool.query(
        `SELECT * FROM cars WHERE category_id = $1`,
        [id]
      );

      if (linked.rows.length > 0) {
        return res.status(400).json({
          message: "Cannot delete category. Cars are linked to this category.",
        });
      }

      const deleted = await CategoryModel.delete(Number(id));

      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // ====================================
  // Get Cars by Category
  // ====================================
  public getCarsByCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const category = await CategoryModel.getById(Number(id));
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const cars = await await pool.query(
        `SELECT * FROM cars WHERE category_id = $1`,
        [id]
      );

      return res.status(200).json({
        category: category.name,
        totalCars: cars.rows.length,
        cars,
      });
    } catch (error: any) {
      console.error("Error fetching cars by category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
