import { Router } from "express";
import CarController from "../controllers/CarController.js";

const router = Router();
const Car = new CarController();

// Get all cars (with filters: location, category, price range, availability)
router.get("/", Car.getAllCars);

// Get single car details by ID (must stay at the bottom to avoid conflicts)
router.get("/:id", Car.getCarById);

export default router;
