import { Router } from "express";
import { DealerReviewsController } from "../../controllers/Dealer/DealerReviewsController.js";

const router = Router();
const Controller = new DealerReviewsController();

router.get("/reviews/:dealerId", Controller.getReviews);

export default router;
