import { Router } from "express";
import dashbaordController from "../controllers/DashboardController.js";

const router = Router();
const Dashboard = new dashbaordController();

router.get("/chart/:renterId", Dashboard.getRenterSpending);

export default router;
