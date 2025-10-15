import { Router } from "express";
import DealerController from "../../controllers/Dealer/DealerController.js";

const router = Router();
const Controller = new DealerController();

router.get("/dashboard/:Dealer_id", Controller.getMainStats);
router.get("/dashboard/recent/:dealer_id", Controller.getRecentBookings);

export default router;
