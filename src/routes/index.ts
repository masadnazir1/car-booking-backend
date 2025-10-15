import { Router } from "express";
import AuthRoutes from "./User/authRoutes.js";
import BookiingRoutes from "./User/bookingRoutes.js";
import CarRoutes from "./User/carRoutes.js";
import brandsRoutes from "./User/BrandsRoutes.js";
import categoriesRoutes from "./User/categoriesRoutes.js";
import DashboardRoutes from "./User/dashboardRoutes.js";
// import CouponRoutes from "./CouponsRoutes.js";
import savedCarsRoutes from "./User/SavedCarRoutes.js";
// import userCouponRoutes from "./UserCouponRoutes.js";
// import userReviewsRoutes from "./ReviewRoutes.js";

//START OF DEALER TOUTES
import DealerRoutes from "./Dealers/DealerRoutes.js";
import DealerVehicleRoutes from "./Dealers/DealerVehicleRoutes.js";
import DealerBookingsRoutes from "./Dealers/DealerBookingsRoutes.js";
import DealerCustomerRoutes from "./Dealers/DealerCustomerRoutes.js";
import messagesRoutes from "./User/messageRoutes.js";

const router = Router();
//
router.use("/messages", messagesRoutes);

//
router.use("/auth", AuthRoutes);
// router.use("/bookings", BookiingRoutes);
router.use("/cars", CarRoutes);
router.use("/barnds", brandsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/dashboard", DashboardRoutes);
router.use("/saved", savedCarsRoutes);
// router.use("/user/coupons", userCouponRoutes);
// router.use("/user/reviews", userReviewsRoutes);

//START OF DEALER TOUTES
//======================//
router.use("/dealer", DealerVehicleRoutes);
router.use("/dealer", DealerBookingsRoutes);
router.use("/dealer", DealerCustomerRoutes);
router.use("/dealer", DealerRoutes);

export default router;
