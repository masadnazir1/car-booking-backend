import { Request, Response } from "express";
import { DealerReviewsService } from "../../services/dealer/DealerReviewsService.js";

export class DealerReviewsController {
  constructor() {}

  /**
   * Get all reviews for a dealer
   */
  public async getReviews(req: Request, res: Response): Promise<void> {
    const { dealerId } = req.params;
    try {
      console.log("dealerId", dealerId);

      if (!dealerId) {
        res.status(400).json({ success: false, message: "Dealer ID required" });
        return;
      }

      const reviews = await DealerReviewsService.getDealerReviews(
        Number(dealerId)
      );

      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } catch (error) {
      console.error("Error fetching dealer reviews:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch dealer reviews" });
    }
  }
}
