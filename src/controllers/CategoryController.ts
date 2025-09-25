import { Request, Response } from "express";
import Category from "../models/Category.js";
import Car from "../models/Car.js";

export default class CategoryController {
  constructor() {}

  //Get all categories (with optional location filter)
  public getAllCategories = async (req: Request, res: Response) => {
    try {
      const { location } = req.query;

      let categories;

      if (location && typeof location === "string" && location.trim()) {
        // Find distinct categoryIds of cars in that location
        const categoryIds = await Car.distinct("categoryId", {
          location: { $regex: new RegExp(location, "i") }, // case-insensitive
        });

        categories = await Category.find({ _id: { $in: categoryIds } }).sort({
          name: 1,
        });
      } else {
        // No location filter → return all categories
        categories = await Category.find().sort({ name: 1 });
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

  //Get category by ID
  public getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({ category });
    } catch (error: any) {
      console.error("Error fetching category by ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //Add a new category
  public addCategory = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Category name is required" });
      }

      // Prevent duplicates
      const exists = await Category.findOne({ name: name.trim() });
      if (exists) {
        return res.status(409).json({ message: "Category already exists" });
      }

      const category = await Category.create({
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

  //Update a category
  public updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true }
      );

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({
        message: "Category updated successfully",
        category,
      });
    } catch (error: any) {
      console.error("Error updating category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //Delete a category (with optional cascade check)
  public deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if any cars are linked to this category
      const linkedCars = await Car.findOne({ categoryId: id });
      if (linkedCars) {
        return res.status(400).json({
          message: "Cannot delete category. Cars are linked to this category.",
        });
      }

      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({
        message: "Category deleted successfully",
        category,
      });
    } catch (error: any) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //Get cars by category (extra endpoint)
  public getCarsByCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const cars = await Car.find({ categoryId: id }).populate(
        "brandId",
        "name"
      );

      return res.status(200).json({
        category: category.name,
        totalCars: cars.length,
        cars,
      });
    } catch (error: any) {
      console.error("Error fetching cars by category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
