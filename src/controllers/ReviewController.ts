import { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

/**
 * Controller responsible for managing user reviews on cars/dealers.
 * Handles creation, fetching, and average rating calculations.
 */
export default class ReviewController {
  constructor() {}

  /**
   * @route POST /api/reviews
   * @desc Submit a review for a completed booking
   * @access User (renter)
   */
  public createReview = async (req: Request, res: Response) => {
    const { bookingId, raterId, dealerId, carId, rating, comment } = req.body;

    try {
      // Validate required fields
      if (!bookingId || !raterId || !dealerId || !carId || !rating) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields." });
      }

      // Validate rating range
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5.",
        });
      }

      // Validate booking ownership
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found." });
      }

      if (booking.renterId.toString() !== raterId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to review this booking.",
        });
      }

      // Ensure the booking is completed
      if (booking.status !== "completed") {
        return res.status(400).json({
          success: false,
          message: "You can only review completed bookings.",
        });
      }

      // Prevent duplicate reviews for same booking
      const existingReview = await Review.findOne({ bookingId, raterId });
      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this booking.",
        });
      }

      // Create the review
      const newReview = await Review.create({
        bookingId,
        raterId,
        dealerId,
        carId,
        rating,
        comment,
      });

      return res.status(201).json({
        success: true,
        message: "Review submitted successfully.",
        data: newReview,
      });
    } catch (error) {
      console.error("Create Review Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error creating review.",
      });
    }
  };

  /**
   * @route GET /api/reviews/car/:carId
   * @desc Get all reviews for a specific car
   * @access Public
   */
  public getCarReviews = async (req: Request, res: Response) => {
    const { carId } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid car ID." });
      }

      const reviews = await Review.find({ carId })
        .populate("raterId", "name email")
        .sort({ createdAt: -1 });

      const avgRating = await Review.aggregate([
        { $match: { carId: new mongoose.Types.ObjectId(carId) } },
        { $group: { _id: "$carId", avgRating: { $avg: "$rating" } } },
      ]);

      return res.json({
        success: true,
        count: reviews.length,
        averageRating: avgRating[0]?.avgRating || 0,
        reviews,
      });
    } catch (error) {
      console.error("Get Car Reviews Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error fetching reviews." });
    }
  };

  /**
   * @route GET /api/reviews/dealer/:dealerId
   * @desc Get all reviews for a specific dealer
   * @access Public / Admin
   */
  public getDealerReviews = async (req: Request, res: Response) => {
    const { dealerId } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(dealerId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid dealer ID." });
      }

      const reviews = await Review.find({ dealerId })
        .populate("raterId", "name email")
        .populate("carId", "name")
        .sort({ createdAt: -1 });

      const avgRating = await Review.aggregate([
        { $match: { dealerId: new mongoose.Types.ObjectId(dealerId) } },
        { $group: { _id: "$dealerId", avgRating: { $avg: "$rating" } } },
      ]);

      return res.json({
        success: true,
        count: reviews.length,
        averageRating: avgRating[0]?.avgRating || 0,
        reviews,
      });
    } catch (error) {
      console.error("Get Dealer Reviews Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error fetching reviews." });
    }
  };

  /**
   * @route DELETE /api/reviews/:id
   * @desc Delete a review (Admin or Owner)
   * @access Admin / Renter
   */
  public deleteReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { requesterId, role } = req.body; // role could be 'admin' or 'user'

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid review ID." });
      }

      const review = await Review.findById(id);
      if (!review) {
        return res
          .status(404)
          .json({ success: false, message: "Review not found." });
      }

      // Authorization: Admins can delete any, users only their own
      if (role !== "admin" && review.raterId.toString() !== requesterId) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized action." });
      }

      await Review.findByIdAndDelete(id);

      return res.json({
        success: true,
        message: "Review deleted successfully.",
      });
    } catch (error) {
      console.error("Delete Review Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error deleting review." });
    }
  };
}
