import { Router } from "express";
import CategoryController from "../../controllers/User/CategoryController.js";

const router = Router();
const controller = new CategoryController();

router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", controller.addCategory);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

// Extra endpoint
router.get("/:id/cars", controller.getCarsByCategory);

export default router;
