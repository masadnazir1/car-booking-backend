import { Request, Response } from "express";
import { DealerReviewsService } from "../../services/dealer/DealerReviews.Service.js";
import { DealerReview } from "../../Interfaces/DealerReviewI.js";

export class DealerReviewsController {
  constructor() {}

  /**
   * Get single review for a dealer
   */
  public async getSingleReview(req: Request, res: Response) {
    const { reviewId: rid } = req.params;
    const { dealer_id: dealerId } = req.body;

    const reviewId: number = rid as unknown as number;
    const dealer_id: number = dealerId as unknown as number;
    try {
      if (!reviewId || !dealer_id) {
        res.status(400).json({
          success: false,
          message: "Dealer ID and REVIEW ID are required",
        });
        return;
      }

      const review: DealerReview =
        await DealerReviewsService.getDealerSingleReivew({
          reviewId,
          dealer_id,
        });

      return res.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      console.error("Error fetching dealer review:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch dealer review" });
    }
  }

  /**
   * Get all reviews for a dealer
   */
  public async getReviews(req: Request, res: Response) {
    const dealerId: number = Number(req.params.dealerId);
    const {
      minRating = 1,
      maxRating = 5,
      car_id,
      booking_id,
      startDate,
      endDate = new Date().toLocaleDateString(),
      page = 1,
      limit = 10,
    } = req.body;

    const skip: number = (page - 1) * limit;

    try {
      if (!dealerId) {
        res.status(400).json({ success: false, message: "Dealer ID required" });
        return;
      }

      let reviews: DealerReview[] = await DealerReviewsService.getDealerReviews(
        {
          dealerId,
          startDate,
          endDate,
          minRating,
          maxRating,
          car_id,
          booking_id,
          limit,
          skip,
        }
      );

      if (reviews.length === 0) {
        return res.status(200).json({
          success: true,
          count: reviews.length,
          data: "Reviews not found!",
        });
      }

      return res.status(200).json({
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
