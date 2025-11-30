import { Router } from "express";
import vehicleController from "../../controllers/Dealer/vehicle.Controller.js";
import { uploadImages } from "../../middleware/uploadImages.js";
const router = Router();
const Controller = new vehicleController();

router.get("/:Dealer_id", Controller.getVehicles);
router.patch("/:dealerId/:carId", Controller.updateSingleVehicle);
router.post("/add", uploadImages.array("images", 10), Controller.addVehicles);

export default router;
