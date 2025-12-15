import { Router } from "express";
import { DealerReviewsController } from "../../controllers/Dealer/DealerReviews.Controller.js";

const router = Router();
const Controller = new DealerReviewsController();

router.get("/review/:reviewId", Controller.getSingleReview);
router.get("/:dealerId", Controller.getReviews);

export default router;
