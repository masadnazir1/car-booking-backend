import express from "express";
import SavedCarController from "../../controllers/User/SavedCarController.js";

const router = express.Router();
const savedCarController = new SavedCarController();

router.post("/save", savedCarController.saveCar);
router.delete("/", savedCarController.removeSavedCar);
router.get("/:userId", savedCarController.getSavedCars);

export default router;
