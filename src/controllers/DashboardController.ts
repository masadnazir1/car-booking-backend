import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

export default class DashboardController {
  constructor() {}

  // Get renter spending in last 6 months (MongoDB)
  public getRenterSpending = async (req: Request, res: Response) => {
    try {
      const { renterId } = req.params;
      if (!renterId) {
        return res.status(400).json({ error: "Renter ID is required" });
      }

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Convert string to ObjectId
      const renterObjectId = new mongoose.Types.ObjectId(renterId);
      // MongoDB aggregation
      const spending = await Booking.aggregate([
        {
          $match: {
            renterId: renterObjectId, // convert to ObjectId
            createdAt: { $gte: sixMonthsAgo },
            paymentStatus: "paid", // only count paid bookings
            status: "completed",
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" }, // group by month number
            totalSpending: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Map month numbers to names
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const labels = spending.map((s) => monthNames[s._id - 1]);
      const data = spending.map((s) => s.totalSpending);

      return res.json({
        labels,
        datasets: [
          {
            label: "Spending (PKR)",
            data,
            backgroundColor: "#10b981",
          },
        ],
      });
    } catch (error) {
      console.error("Error in getRenterSpending:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
