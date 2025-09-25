// src/routes/review.routes.ts
import { Router } from "express";
import ReviewController from "../controllers/ReviewController.js";

const router = Router();
const Review = new ReviewController();

//Create a review
router.post("/create", Review.createReview);

//Get reviews for a car
router.get("/car/:carId", Review.getReviewsForCar);

//Get reviews by user
router.get("/user/:userId", Review.getUserReviews);

//Delete review
router.delete("/delete", Review.deleteReview);

export default router;
