import { Request, Response } from "express";
import { pool } from "../../config/db.js";

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
  /**
   * Create a new review
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

      if (bookingResult.rowCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found." });
      }

      const booking = bookingResult.rows[0];

      if (booking.renter_id !== Number(rater_id)) {
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

      if (existing?.rowCount && existing.rowCount > 0) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this booking.",
        });
      }

      // Insert new review
      const insertQuery = `
        INSERT INTO reviews 
          (booking_id, rater_id, dealer_id, car_id, rating, comment)
        VALUES 
          ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const inserted = await pool.query(insertQuery, [
        booking_id,
        rater_id,
        dealer_id,
        car_id,
        rating,
        comment || null,
      ]);

      return res.status(201).json({
        success: true,
        message: "Review submitted successfully.",
        review: inserted.rows[0],
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
}
