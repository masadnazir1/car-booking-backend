import { Router } from "express";
import AuthRoutes from "./authRoutes.js";
import BookiingRoutes from "./bookingRoutes.js";
import CarRoutes from "./carRoutes.js";
import brandsRoutes from "./BrandsRoutes.js";
import categoriesRoutes from "./categoriesRoutes.js";
import DashboardRoutes from "./dashboardRoutes.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/bookings", BookiingRoutes);
router.use("/cars", CarRoutes);
router.use("/barnds", brandsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/dashboard", DashboardRoutes);

export default router;
