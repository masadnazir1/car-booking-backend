import { Router } from "express";
import CarController from "../controllers/CarController.js";

const router = Router();
const Car = new CarController();

// Search cars by location / keyword
router.get("/search/:location", Car.searchCarsByLocation);

// Get cars by category (SUV, Sedan, etc.)
router.get("/category/:categoryId", Car.getCarsByCategory);

// Get cars within a price range
router.get("/price/:min/:max", Car.getCarsByPriceRange);

// Get all cars (with filters: location, category, price range, availability)
router.get("/", Car.getAllCars);

// Get single car details by ID (must stay at the bottom to avoid conflicts)
router.get("/:id", Car.getCarById);

// Add a car
router.post("/add", Car.addCar);

export default router;
