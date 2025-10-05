import { Request, Response } from "express";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import { Coupon } from "../models/Coupon.js";
import { UserCoupon } from "../models/UserCoupon.js";
import mongoose from "mongoose";

export default class BookingController {
  constructor() {}

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

    try {
      // ------------------- VALIDATION -------------------
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
        return res.status(400).json({
          success: false,
          message: "Invalid date format.",
        });
      }

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date.",
        });
      }

      // ------------------- ACTIVE BOOKING CHECK -------------------
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const activeBooking = await Booking.findOne({
        renterId,
        startDate: { $gte: today },
        status: { $in: ["pending", "confirmed"] },
      });

      if (activeBooking) {
        return res.status(409).json({
          success: false,
          message: "You already have a pending or confirmed booking.",
        });
      }

      // ------------------- FETCH CAR -------------------
      const car = await Car.findById(carId);
      if (!car) {
        return res
          .status(404)
          .json({ success: false, message: "Car not found." });
      }

      // ------------------- PRICE CALCULATION -------------------
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = days * car.dailyRate;

      // ------------------- COUPON LOGIC -------------------
      let discount = 0;
      let finalAmount = totalAmount;
      let appliedCoupon: mongoose.Types.ObjectId | null = null;

      if (couponCode) {
        const coupon = await Coupon.findOne({
          code: couponCode.toUpperCase(),
        });

        if (!coupon)
          return res
            .status(404)
            .json({ success: false, message: "Invalid coupon code." });

        // Ensure user owns this coupon
        const userCoupon = await UserCoupon.findOne({
          userId: renterId,
          couponId: coupon._id,
        });

        if (!userCoupon)
          return res.status(403).json({
            success: false,
            message: "This coupon is not assigned to your account.",
          });

        // Check coupon validity
        const now = new Date();
        if (coupon.status !== "active" || now > coupon.endDate) {
          return res.status(400).json({
            success: false,
            message: "Coupon expired or inactive.",
          });
        }

        // Check minimum booking amount (if set)
        if (coupon.minBookingAmount && totalAmount < coupon.minBookingAmount) {
          return res.status(400).json({
            success: false,
            message: `Minimum booking amount must be ${coupon.minBookingAmount}.`,
          });
        }

        // Calculate discount
        if (coupon.discountType === "percentage") {
          discount = (totalAmount * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount)
            discount = coupon.maxDiscount;
        } else if (coupon.discountType === "flat") {
          discount = coupon.discountValue;
        }

        finalAmount = Math.max(totalAmount - discount, 0); // prevent negative
        appliedCoupon = coupon._id;

        // ------------------- UPDATE THE STATUS OF COUPON -------------------
      }

      // ------------------- CREATE BOOKING -------------------
      const booking = await Booking.create({
        carId,
        renterId,
        dealerId,
        startDate: start,
        endDate: end,
        days,
        pickupLocation,
        dropoffLocation,
        totalPrice: totalAmount,
        discount,
        finalAmount,
        couponId: appliedCoupon,
        status: "pending",
        paymentStatus: "unpaid",
      });

      if (booking) {
        const coupon = await Coupon.findOne({
          code: couponCode.toUpperCase(),
        });

        const userCoupon = await UserCoupon.findOne({
          userId: renterId,
          couponId: coupon?._id,
        });

        await userCoupon?.updateOne({
          userId: renterId,
          couponId: coupon?._id,
          used: true,
        });
      }

      // ------------------- RESPONSE -------------------
      return res.status(201).json({
        success: true,
        message: "Booking created successfully.",
        booking: {
          id: booking._id,
          car: car.name,
          days,
          totalAmount,
          discount,
          finalAmount,
          couponApplied: couponCode || null,
          startDate: booking.startDate,
          endDate: booking.endDate,
        },
      });
    } catch (error: any) {
      console.error("Booking creation error:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while creating the booking.",
      });
    }
  };

  // Get all bookings for a user
  public getAllBookings = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const bookings = await Booking.find({ renterId: userId })
        .populate("carId")
        .sort({ createdAt: -1 });

      if (!bookings.length) {
        return res.status(404).json({ message: "No bookings found" });
      }

      return res.status(200).json({ bookings });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //Get single booking by ID
  public getSingleBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id).populate("carId");

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      return res.status(200).json({ booking });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //Cancel a booking
  public cancelBooking = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findById(id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Only pending bookings can be cancelled" });
      }

      booking.status = "cancelled";
      await booking.save();

      return res
        .status(200)
        .json({ message: "Booking cancelled successfully", booking });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // Get upcoming bookings for a user
  public getUpcomingBookings = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
      console.log("userId", userId);
      if (!userId) return res.status(400).json({ error: "userId is required" });

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // start of today in UTC
      const bookings = await Booking.find({
        renterId: userId,
        startDate: { $gte: today },
        status: { $in: ["pending", "confirmed"] },
      }).populate("carId");

      return res.status(200).json({ bookings });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //Get past bookings for a user
  public getPastBookings = async (req: Request, res: Response) => {
    const { userId } = req.query;
    try {
      if (!userId) return res.status(400).json({ error: "userId is required" });

      const today = new Date();
      const bookings = await Booking.find({
        renterId: userId,
        endDate: { $lt: today },
      }).populate("carId");

      return res.status(200).json({ bookings });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
