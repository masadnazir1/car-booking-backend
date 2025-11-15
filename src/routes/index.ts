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
import userReviewsRoutes from "./User/ReviewRoutes.js";
import searchCarRoutes from "./User/searchCarRoutes.js";
import contactUsRoutes from "./User/contactUsRoutes.js";

//START OF DEALER TOUTES
import DealerRoutes from "./Dealers/Dealer.Routes.js";
import DealerVehicleRoutes from "./Dealers/DealerVehicle.Routes.js";
import DealerBookingsRoutes from "./Dealers/DealerBookings.Routes.js";
import DealerCustomerRoutes from "./Dealers/DealerCustomer.Routes.js";
import messagesRoutes from "./User/messageRoutes.js";
import DealeBusinessRoutes from "./Dealers/DealerBusiness.Routes.js";
import DealerReviewsRoutes from "./Dealers/DealerReviews.Routes.js";
import InvoicesRoutes from "./Dealers/Invoice.Routes.js";
import BrandsRoutes from "./Dealers/brands.routes.js";
import CategoriesRoutes from "./Dealers/categories.routes.js";

const router = Router();
//
router.use("/messages", messagesRoutes);
router.use("/contact", contactUsRoutes);
//
router.use("/auth", AuthRoutes);
router.use("/bookings", BookiingRoutes);
router.use("/cars", CarRoutes);
router.use("/barnds", brandsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/dashboard", DashboardRoutes);
router.use("/saved", savedCarsRoutes);
// router.use("/user/coupons", userCouponRoutes);
router.use("/user/reviews", userReviewsRoutes);
router.use("/user/cars", searchCarRoutes);

//START OF DEALER TOUTES
//======================//
router.use("/auth", AuthRoutes);
router.use("/dealer/invoice", InvoicesRoutes);
router.use("/dealer/vehicle", DealerVehicleRoutes);
router.use("/dealer/bookings", DealerBookingsRoutes);
router.use("/dealer/customers", DealerCustomerRoutes);
router.use("/dealer/dashboard", DealerRoutes);
router.use("/dealer/reviews", DealerReviewsRoutes);
router.use("/dealer/brands", BrandsRoutes);
router.use("/dealer/categories", CategoriesRoutes);
router.use("/dealer", DealeBusinessRoutes);

export default router;
