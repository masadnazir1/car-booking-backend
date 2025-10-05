import express from "express";
import ReviewController from "../controllers/ReviewController.js";

const router = express.Router();
const reviewController = new ReviewController();

router.post("/", reviewController.createReview);
router.get("/car/:carId", reviewController.getCarReviews);
router.get("/dealer/:dealerId", reviewController.getDealerReviews);
router.delete("/:id", reviewController.deleteReview);

export default router;
