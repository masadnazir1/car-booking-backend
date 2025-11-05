import { Router } from "express";
import CarSearchController from "../../controllers/User/carSearchController.js";

const router = Router();
const auth = new CarSearchController();

router.get("/search", auth.searchCar);

export default router;
