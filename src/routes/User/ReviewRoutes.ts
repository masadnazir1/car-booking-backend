import express from "express";
import ReviewController from "../../controllers/User/ReviewController.js";

const router = express.Router();
const reviewController = new ReviewController();

router.post("/", reviewController.createReview);
router.get("/dealer/:dealerId", reviewController.getDealerReviews);

export default router;
