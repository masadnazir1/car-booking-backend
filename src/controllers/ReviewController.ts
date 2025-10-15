import { Request, Response } from "express";
import { reviewModel } from "../models/reviewModel.js";
import { pool } from "../config/db.js";

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
    const { booking_id, rater_id, dealer_id, car_id, rating, comment } =
      req.body;

    try {
      if (!booking_id || !rater_id || !dealer_id || !car_id || !rating) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields." });
      }

      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ success: false, message: "Rating must be between 1 and 5." });
      }

      // Validate booking ownership
      const bookingResult = await pool.query(
        `SELECT renter_id, status FROM bookings WHERE id = $1`,
        [booking_id]
      );

      const booking = bookingResult.rows[0];
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found." });
      }

      if (booking.renter_id !== rater_id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to review this booking.",
        });
      }

      if (booking.status !== "completed") {
        return res.status(400).json({
          success: false,
          message: "You can only review completed bookings.",
        });
      }

      // Prevent duplicate reviews for the same booking
      const existing = await pool.query(
        `SELECT id FROM reviews WHERE booking_id = $1 AND rater_id = $2`,
        [booking_id, rater_id]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this booking.",
        });
      }

      // Create the review
      const newReview = await reviewModel.create({
        booking_id,
        rater_id,
        dealer_id,
        car_id,
        rating,
        comment,
        id: 0,
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
      const reviews = await reviewModel.getByCar(Number(carId));

      const avgResult = await pool.query(
        `SELECT AVG(rating)::numeric(10,2) AS avg_rating FROM reviews WHERE car_id = $1`,
        [carId]
      );

      const avgRating = avgResult.rows[0]?.avg_rating || 0;

      return res.json({
        success: true,
        count: reviews.length,
        averageRating: parseFloat(avgRating),
        reviews,
      });
    } catch (error) {
      console.error("Get Car Reviews Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching reviews.",
      });
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
      const { rows: reviews } = await pool.query(
        `SELECT * FROM reviews WHERE dealer_id = $1 ORDER BY created_at DESC`,
        [dealerId]
      );

      const avgResult = await pool.query(
        `SELECT AVG(rating)::numeric(10,2) AS avg_rating FROM reviews WHERE dealer_id = $1`,
        [dealerId]
      );

      const avgRating = avgResult.rows[0]?.avg_rating || 0;

      return res.json({
        success: true,
        count: reviews.length,
        averageRating: parseFloat(avgRating),
        reviews,
      });
    } catch (error) {
      console.error("Get Dealer Reviews Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching reviews.",
      });
    }
  };

  /**
   * @route DELETE /api/reviews/:id
   * @desc Delete a review (Admin or Owner)
   * @access Admin / Renter
   */
  public deleteReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { requester_id, role } = req.body; // 'admin' or 'user'

    try {
      const { rows } = await pool.query(`SELECT * FROM reviews WHERE id = $1`, [
        id,
      ]);
      const review = rows[0];

      if (!review) {
        return res
          .status(404)
          .json({ success: false, message: "Review not found." });
      }

      if (role !== "admin" && review.rater_id !== requester_id) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized action." });
      }

      const deleted = await reviewModel.delete(Number(id));
      if (!deleted) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to delete review." });
      }

      return res.json({
        success: true,
        message: "Review deleted successfully.",
      });
    } catch (error) {
      console.error("Delete Review Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error deleting review.",
      });
    }
  };
}
