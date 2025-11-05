import { Router } from "express";
import BookingController from "../../controllers/User/BookingController.js";

const router = Router();
const Booking = new BookingController();

// User side routes
router.post("/create", Booking.CreateBooking);
router.get("/", Booking.getAllBookings);
router.get("/:id", Booking.getSingleBooking);
router.put("/:id/cancel", Booking.cancelBooking);
router.get("/user/upcoming", Booking.getUpcomingBookings);
router.get("/user/past", Booking.getPastBookings);

export default router;
