import { Router } from "express";
import CategoriesController from "../../controllers/Dealer/categories.Controller.js";

const router = Router();
const Controller = new CategoriesController();

router.get("/", Controller.getCategories);

export default router;
