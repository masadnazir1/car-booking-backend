import { Router } from "express";
import BrandController from "../../controllers/Dealer/brands.Controller.js";

const router = Router();
const Controller = new BrandController();

router.get("/", Controller.getBrands);

export default router;
