import { Router } from "express";
import vehicleController from "../../controllers/Dealer/vehicleController.js";
import { uploadCarImages } from "../../middleware/uploadCarImages.js";
const router = Router();
const Controller = new vehicleController();

router.get("/vehicle/:Dealer_id", Controller.getVehicles);
router.post(
  "/vehicle/add",
  uploadCarImages.array("images", 10),
  Controller.addVehicles
);

export default router;
