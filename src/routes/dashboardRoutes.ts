import { Router } from "express";
import dashbaordController from "../controllers/DashboardController.js";

const router = Router();

router.get("/renter/:renterId/spending", dashbaordController.getRenterSpending);

export default router;
