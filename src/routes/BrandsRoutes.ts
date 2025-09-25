import { Router } from "express";
import BrandController from "../controllers/BrandController.js";

const router = Router();
const Brands = new BrandController();

//User/Admin routes
router.get("/", Brands.getBrands); // Get all brands (with optional location filter)
router.post("/", Brands.createBrand); // Create new brand
router.get("/:id", Brands.getBrandById); // Get brand by ID
router.put("/:id", Brands.updateBrand); // Update brand by ID
router.delete("/:id", Brands.deleteBrand); // Delete brand by ID

export default router;
