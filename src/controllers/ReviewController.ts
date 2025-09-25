import { Request, Response } from "express";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

export default class ReviewController {
  constructor() {}

  //Create a review
  public createReview = async (req: Request, res: Response) => {
    try {
      const { bookingId, raterId, dealerId, carId, rating, comment } = req.body;

      if (!bookingId || !raterId || !dealerId || !carId || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      //Verify booking exists
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      //Prevent duplicate reviews for the same booking
      const existingReview = await Review.findOne({ bookingId, raterId });
      if (existingReview) {
        return res
          .status(400)
          .json({ message: "You already reviewed this booking" });
      }

      const review = await Review.create({
        bookingId,
        raterId,
        dealerId,
        carId,
        rating,
        comment,
      });

      return res.status(201).json({
        message: "Review created successfully",
        review,
      });
    } catch (error: any) {
      console.error("Review creation error:", error);
      return res.status(500).json({ message: "Failed to create review" });
    }
  };

  //Get reviews for a specific car
  public getReviewsForCar = async (req: Request, res: Response) => {
    try {
      const { carId } = req.params;

      if (!carId) {
        return res.status(400).json({ message: "carId is required" });
      }

      const reviews = await Review.find({ carId })
        .populate("raterId", "name email")
        .populate("bookingId", "_id startDate endDate");

      return res.status(200).json({ reviews });
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  };

  //Get reviews by a user
  public getUserReviews = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const reviews = await Review.find({ raterId: userId })
        .populate("carId", "name category dailyRate")
        .populate("dealerId", "name email");

      return res.status(200).json({ reviews });
    } catch (error: any) {
      console.error("Error fetching user reviews:", error);
      return res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  };

  //Delete a review (only by the user who wrote it)
  public deleteReview = async (req: Request, res: Response) => {
    try {
      const { reviewId, userId } = req.body;

      if (!reviewId || !userId) {
        return res
          .status(400)
          .json({ message: "reviewId and userId are required" });
      }

      const review = await Review.findOneAndDelete({
        _id: reviewId,
        raterId: userId,
      });

      if (!review) {
        return res
          .status(404)
          .json({ message: "Review not found or not authorized" });
      }

      return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting review:", error);
      return res.status(500).json({ message: "Failed to delete review" });
    }
  };
}
