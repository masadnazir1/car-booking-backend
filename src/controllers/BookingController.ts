import { Request, Response } from "express";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export default class BookingController {
  constructor() {}

  //Create a booking
  public CreateBooking = async (req: Request, res: Response) => {
    try {
      const {
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        carId,
        renterId,
        dealerId,
      } = req.body;

      if (
        !pickupLocation ||
        !dropoffLocation ||
        !carId ||
        !renterId ||
        !dealerId
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Calculate days & totalPrice dynamically
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      const car = await Car.findById(carId);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }

      const totalPrice = days * car.dailyRate;

      const booking = await Booking.create({
        carId,
        renterId,
        dealerId,
        startDate: start,
        endDate: end,
        days,
        totalPrice,
        pickupLocation,
        dropoffLocation,
        status: "pending",
        paymentStatus: "unpaid",
      });

      return res.status(201).json({
        message: "Booking created successfully",
        booking,
      });
    } catch (error: any) {
      console.error("Booking creation error:", error);
      return res.status(500).json({ message: "Failed to create booking" });
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
      console.log("today", today);
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
