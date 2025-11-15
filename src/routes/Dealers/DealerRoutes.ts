import { Router } from "express";
import DealerController from "../../controllers/Dealer/DealerController.js";

const router = Router();
const Controller = new DealerController();

router.get("/:Dealer_id", Controller.getMainStats);
router.get("/recent/:dealer_id", Controller.getRecentBookings);

export default router;
