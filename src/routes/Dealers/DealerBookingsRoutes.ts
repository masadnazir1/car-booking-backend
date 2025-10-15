import { Router } from "express";
import { DealerBookingsController } from "../../controllers/Dealer/DealerBookingsController.js";

const router = Router();
const Controller = new DealerBookingsController();

router.get("/bookings/:dealer_id", Controller.getRecentBookings);
router.get("/bookings/status/:dealer_id", Controller.getBookingsStatus);

export default router;
