import { Router } from "express";
import vehicleController from "../../controllers/Dealer/vehicleController.js";
import { uploadImages } from "../../middleware/uploadImages.js";
const router = Router();
const Controller = new vehicleController();

router.get("/vehicle/:Dealer_id", Controller.getVehicles);
router.post(
  "/vehicle/add",
  uploadImages.array("images", 10),
  Controller.addVehicles
);

export default router;
