import { Router } from "express";
import { DealerBookingsController } from "../../controllers/Dealer/DealerBookings.Controller.js";

const router = Router();
const Controller = new DealerBookingsController();

router.get("/:dealer_id", Controller.getRecentBookings);
router.get("/status/:dealer_id", Controller.getBookingsStatus);
router.get("/details/:booking_id", Controller.getBookingsDetails);
router.patch("/:booking_id", Controller.updateBookings);

export default router;
