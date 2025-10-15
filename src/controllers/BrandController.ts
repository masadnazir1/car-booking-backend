import { Request, Response } from "express";
import { BrandModel } from "../models/brandModel.js";

export default class BrandController {
  constructor() {}

  //  Create a new brand
  public createBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, slug, logo, country, description, founded_year, website } =
        req.body;

      if (!name?.trim() || !slug?.trim()) {
        res
          .status(400)
          .json({ success: false, message: "Name and slug are required" });
        return;
      }

      const existing = await BrandModel.getBySlug(slug.trim());
      if (existing) {
        res
          .status(409)
          .json({ success: false, message: "Brand already exists" });
        return;
      }

      const brand = await BrandModel.create({
        name: name.trim(),
        slug: slug.trim(),
        logo,
        country,
        description,
        founded_year,
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

  //  Get all brands (with optional location filter)
  public getBrands = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location } = req.query;

      const brands = await BrandModel.getLocation(location?.toString());
      res.status(200).json({ success: true, data: brands });
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ success: false, message: "Failed to get brands" });
    }
  };

  //  Get brand by ID
  public getBrandById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const brand = await BrandModel.getById(Number(id));

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

  //  Update brand
  public updateBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updated = await BrandModel.update(Number(id), req.body);

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

  //  Delete brand
  public deleteBrand = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await BrandModel.delete(Number(id));

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
