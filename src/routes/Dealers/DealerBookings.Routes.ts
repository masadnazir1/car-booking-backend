import { Router } from "express";
import { DealerBookingsController } from "../../controllers/Dealer/DealerBookingsController.js";

const router = Router();
const Controller = new DealerBookingsController();

router.get("/:dealer_id", Controller.getRecentBookings);
router.get("/status/:dealer_id", Controller.getBookingsStatus);
router.get("/details/:booking_id", Controller.getBookingsDetails);

export default router;
