import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

/**
 * Dashboard-Controller
 * -------------------
 * Handles renter dashboard related aggregations such as spending over time.
 * This controller calculates:
 * 1. Monthly spending for the last 6 months.
 * 2. Percentage change compared to the previous 6 months.
 *
 * Response format:
 * {
 *   labels: string[],        // month names
 *   percentage: string,      // percentage change as "+10.00%" or "-5.50%"
 *   datasets: [
 *     {
 *       label: "Spending (PKR)",
 *       data: number[],       // monthly totals
 *       backgroundColor: string
 *     }
 *   ]
 * }
 */
export default class DashboardController {
  constructor() {}

  public getRenterSpending = async (req: Request, res: Response) => {
    const { renterId } = req.params;

    try {
      if (!renterId) {
        return res.status(400).json({ error: "Renter ID is required" });
      }

      const renterObjectId = new mongoose.Types.ObjectId(renterId);
      const now = new Date();

      // Last 6 months range
      const last6Start = new Date(now);
      last6Start.setMonth(now.getMonth() - 6);

      const last6End = new Date(now);
      last6End.setHours(23, 59, 59, 999);

      // Previous 6 months range (6 months before last6Start)
      const prev6Start = new Date(last6Start);
      prev6Start.setMonth(prev6Start.getMonth() - 6);

      const prev6End = new Date(last6Start);
      prev6End.setHours(23, 59, 59, 999);

      // Aggregate last 6 months revenue
      const last6Revenue = await Booking.aggregate([
        {
          $match: {
            renterId: renterObjectId,
            createdAt: { $gte: last6Start, $lte: last6End },
            paymentStatus: "paid",
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);

      // Aggregate previous 6 months revenue
      const prev6Revenue = await Booking.aggregate([
        {
          $match: {
            renterId: renterObjectId,
            createdAt: { $gte: prev6Start, $lte: prev6End },
            paymentStatus: "paid",
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);

      const last6Total = last6Revenue[0]?.total || 0;
      const prev6Total = prev6Revenue[0]?.total || 0;

      // Calculate percentage change
      let percentage = "0.00%";
      if (prev6Total > 0) {
        const change = ((last6Total - prev6Total) / prev6Total) * 100;
        const sign = change >= 0 ? "+" : "-";
        percentage = `${sign}${Math.abs(change).toFixed(2)}%`;
      } else if (last6Total > 0) {
        percentage = "+100.00%";
      }

      // Aggregate spending per month for last 6 months
      const spending = await Booking.aggregate([
        {
          $match: {
            renterId: renterObjectId,
            createdAt: { $gte: last6Start, $lte: last6End },
            paymentStatus: "paid",
            status: "completed",
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalSpending: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

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
        percentage, // added percentage
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
