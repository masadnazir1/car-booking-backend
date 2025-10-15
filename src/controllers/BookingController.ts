import { Request, Response } from "express";
import { pool } from "../config/db.js";

export default class BookingController {
  constructor() {}

  /**
   * @route POST /api/bookings
   * @desc Create a new booking with optional coupon
   * @access Renter (User)
   */
  public CreateBooking = async (req: Request, res: Response) => {
    const {
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      carId,
      renterId,
      dealerId,
      couponCode,
    } = req.body;

    const client = await pool.connect();

    try {
      // ================= VALIDATION =================
      if (
        !startDate ||
        !endDate ||
        !pickupLocation ||
        !dropoffLocation ||
        !carId ||
        !renterId ||
        !dealerId
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields.",
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format." });
      }

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date.",
        });
      }

      // ================= ACTIVE BOOKING CHECK =================
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const activeBooking = await client.query(
        `SELECT id FROM bookings
         WHERE renter_id = $1 
         AND start_date >= $2 
         AND status IN ('pending', 'confirmed')
         LIMIT 1`,
        [renterId, today]
      );

      if (activeBooking.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "You already have a pending or confirmed booking.",
        });
      }

      // ================= FETCH CAR =================
      const carRes = await client.query(
        `SELECT id, name, daily_rate FROM cars WHERE id = $1`,
        [carId]
      );

      const car = carRes.rows[0];
      if (!car) {
        return res
          .status(404)
          .json({ success: false, message: "Car not found." });
      }

      // ================= PRICE CALCULATION =================
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = days * car.daily_rate;

      // ================= COUPON LOGIC =================
      let discount = 0;
      let finalAmount = totalAmount;
      let appliedCouponId: number | null = null;

      if (couponCode) {
        const couponRes = await client.query(
          `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) LIMIT 1`,
          [couponCode]
        );

        const coupon = couponRes.rows[0];
        if (!coupon)
          return res
            .status(404)
            .json({ success: false, message: "Invalid coupon code." });

        // Validate ownership
        const userCouponRes = await client.query(
          `SELECT * FROM user_coupons WHERE user_id = $1 AND coupon_id = $2`,
          [renterId, coupon.id]
        );

        const userCoupon = userCouponRes.rows[0];
        if (!userCoupon)
          return res.status(403).json({
            success: false,
            message: "This coupon is not assigned to your account.",
          });

        // Validity check
        const now = new Date();
        if (coupon.status !== "active" || now > coupon.end_date) {
          return res
            .status(400)
            .json({ success: false, message: "Coupon expired or inactive." });
        }

        if (
          coupon.min_booking_amount &&
          totalAmount < coupon.min_booking_amount
        ) {
          return res.status(400).json({
            success: false,
            message: `Minimum booking amount must be ${coupon.min_booking_amount}.`,
          });
        }

        // Calculate discount
        if (coupon.discount_type === "percentage") {
          discount = (totalAmount * coupon.discount_value) / 100;
          if (coupon.max_discount && discount > coupon.max_discount)
            discount = coupon.max_discount;
        } else if (coupon.discount_type === "flat") {
          discount = coupon.discount_value;
        }

        finalAmount = Math.max(totalAmount - discount, 0);
        appliedCouponId = coupon.id;
      }

      // ================= CREATE BOOKING =================
      const insertBooking = await client.query(
        `INSERT INTO bookings 
          (car_id, renter_id, dealer_id, start_date, end_date, days, pickup_location, dropoff_location, total_price, discount, final_amount, coupon_id, status, payment_status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending','unpaid')
         RETURNING *`,
        [
          carId,
          renterId,
          dealerId,
          start,
          end,
          days,
          pickupLocation,
          dropoffLocation,
          totalAmount,
          discount,
          finalAmount,
          appliedCouponId,
        ]
      );

      const booking = insertBooking.rows[0];

      // Mark coupon as used
      if (couponCode && appliedCouponId) {
        await client.query(
          `UPDATE user_coupons 
           SET used = TRUE 
           WHERE user_id = $1 AND coupon_id = $2`,
          [renterId, appliedCouponId]
        );
      }

      // ================= RESPONSE =================
      return res.status(201).json({
        success: true,
        message: "Booking created successfully.",
        booking: {
          id: booking.id,
          car: car.name,
          days,
          totalAmount,
          discount,
          finalAmount,
          couponApplied: couponCode || null,
          startDate: booking.start_date,
          endDate: booking.end_date,
        },
      });
    } catch (error: any) {
      console.error("Booking creation error:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while creating the booking.",
      });
    } finally {
      client.release();
    }
  };

  /**
   * @route GET /api/bookings?userId=#
   * @desc Get all bookings for a renter
   */
  public getAllBookings = async (req: Request, res: Response) => {
    const { userId } = req.query;
    try {
      if (!userId) return res.status(400).json({ error: "userId is required" });

      const { rows: bookings } = await pool.query(
        `SELECT b.*, c.name AS car_name, c.image AS car_image
         FROM bookings b
         JOIN cars c ON b.car_id = c.id
         WHERE renter_id = $1
         ORDER BY b.created_at DESC`,
        [userId]
      );

      if (!bookings.length)
        return res.status(404).json({ message: "No bookings found" });

      return res.status(200).json({ bookings });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * @route GET /api/bookings/:id
   * @desc Get a single booking by ID
   */
  public getSingleBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(
        `SELECT b.*, c.name AS car_name, c.image AS car_image
         FROM bookings b
         JOIN cars c ON b.car_id = c.id
         WHERE b.id = $1`,
        [id]
      );

      const booking = rows[0];
      if (!booking)
        return res.status(404).json({ message: "Booking not found" });

      return res.status(200).json({ booking });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * @route PATCH /api/bookings/:id/cancel
   * @desc Cancel a pending booking
   */
  public cancelBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { rows } = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [id]
      );
      const booking = rows[0];

      if (!booking)
        return res.status(404).json({ message: "Booking not found" });

      if (booking.status !== "pending")
        return res
          .status(400)
          .json({ message: "Only pending bookings can be cancelled" });

      await pool.query(
        `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
        [id]
      );

      return res
        .status(200)
        .json({ message: "Booking cancelled successfully" });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * @route GET /api/bookings/upcoming?userId=#
   * @desc Get upcoming bookings (pending or confirmed)
   */
  public getUpcomingBookings = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
      if (!userId) return res.status(400).json({ error: "userId is required" });

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const { rows: bookings } = await pool.query(
        `SELECT b.*, c.name AS car_name
         FROM bookings b
         JOIN cars c ON b.car_id = c.id
         WHERE b.renter_id = $1
         AND b.start_date >= $2
         AND b.status IN ('pending', 'confirmed')`,
        [userId, today]
      );

      return res.status(200).json({ bookings });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * @route GET /api/bookings/past?userId=#
   * @desc Get past (completed/ended) bookings
   */
  public getPastBookings = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
      if (!userId) return res.status(400).json({ error: "userId is required" });

      const today = new Date();

      const { rows: bookings } = await pool.query(
        `SELECT b.*, c.name AS car_name
         FROM bookings b
         JOIN cars c ON b.car_id = c.id
         WHERE b.renter_id = $1
         AND b.end_date < $2
         ORDER BY b.end_date DESC`,
        [userId, today]
      );

      return res.status(200).json({ bookings });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
