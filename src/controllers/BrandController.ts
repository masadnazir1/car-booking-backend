import { Request, Response } from "express";
import Brand from "../models/Brand.js";
import Car from "../models/Car.js";

export default class BrandController {
  constructor() {}

  // 🔹 Create a new brand
  public createBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, slug, logo, country, description, foundedYear, website } =
        req.body;

      const existing = await Brand.findOne({ name: name.trim() });
      if (existing) {
        res
          .status(400)
          .json({ success: false, message: "Brand already exists" });
        return;
      }

      const brand = await Brand.create({
        name,
        slug,
        logo,
        country,
        description,
        foundedYear,
        website,
      });

      res.status(201).json({ success: true, data: brand });
    } catch (error: any) {
      console.error("Error creating brand:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create brand" });
    }
  };

  // 🔹 Get all brands (with optional location filter)
  public getBrands = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location } = req.query; // /api/brands?location=lahore

      if (location) {
        // Fetch only brands that have cars in this location
        const brandIds = await Car.find({
          location: location.toString().toLowerCase(),
        }).distinct("brandId");

        const brands = await Brand.find({ _id: { $in: brandIds } });
        res.status(200).json({ success: true, data: brands });
        return;
      }

      // Fetch all brands
      const brands = await Brand.find();
      res.status(200).json({ success: true, data: brands });
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ success: false, message: "Failed to get brands" });
    }
  };

  // 🔹 Get single brand by ID
  public getBrandById = async (req: Request, res: Response): Promise<void> => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) {
        res.status(404).json({ success: false, message: "Brand not found" });
        return;
      }
      res.status(200).json({ success: true, data: brand });
    } catch (error: any) {
      console.error("Error fetching brand:", error);
      res.status(500).json({ success: false, message: "Failed to get brand" });
    }
  };

  // 🔹 Update brand
  public updateBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        res.status(404).json({ success: false, message: "Brand not found" });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      console.error("Error updating brand:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update brand" });
    }
  };

  // 🔹 Delete brand
  public deleteBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await Brand.findByIdAndDelete(req.params.id);

      if (!deleted) {
        res.status(404).json({ success: false, message: "Brand not found" });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "Brand deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete brand" });
    }
  };
}
