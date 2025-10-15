import { Request, Response } from "express";
import { pool } from "../config/db.js";

/**
 * DashboardController (PostgreSQL)
 * --------------------------------
 * Generates renter dashboard analytics:
 * 1. Monthly spending for the last 6 months.
 * 2. Percentage change compared to previous 6 months.
 */
export default class DashboardController {
  public static async getRenterSpending(req: Request, res: Response) {
    const { renterId } = req.params;

    try {
      if (!renterId) {
        return res.status(400).json({ error: "Renter ID is required" });
      }

      const now = new Date();

      // Last 6 months range
      const last6Start = new Date(now);
      last6Start.setMonth(now.getMonth() - 6);
      last6Start.setHours(0, 0, 0, 0);

      const last6End = new Date(now);
      last6End.setHours(23, 59, 59, 999);

      // Previous 6 months range
      const prev6Start = new Date(last6Start);
      prev6Start.setMonth(prev6Start.getMonth() - 6);
      prev6Start.setHours(0, 0, 0, 0);

      const prev6End = new Date(last6Start);
      prev6End.setHours(23, 59, 59, 999);

      // Convert to ISO for PostgreSQL timestamp
      const last6StartISO = last6Start.toISOString();
      const last6EndISO = last6End.toISOString();
      const prev6StartISO = prev6Start.toISOString();
      const prev6EndISO = prev6End.toISOString();

      // ===============================
      // Total revenue for last 6 months
      // ===============================
      const last6Query = `
        SELECT COALESCE(SUM(total_price), 0) AS total
        FROM bookings
        WHERE renter_id = $1
          AND created_at BETWEEN $2 AND $3
          AND payment_status = 'paid'
          AND status = 'completed';
      `;
      const last6Result = await pool.query(last6Query, [
        renterId,
        last6StartISO,
        last6EndISO,
      ]);

      // ===============================
      // Total revenue for previous 6 months
      // ===============================
      const prev6Query = `
        SELECT COALESCE(SUM(total_price), 0) AS total
        FROM bookings
        WHERE renter_id = $1
          AND created_at BETWEEN $2 AND $3
          AND payment_status = 'paid'
          AND status = 'completed';
      `;
      const prev6Result = await pool.query(prev6Query, [
        renterId,
        prev6StartISO,
        prev6EndISO,
      ]);

      const last6Total = parseFloat(last6Result.rows[0]?.total || 0);
      const prev6Total = parseFloat(prev6Result.rows[0]?.total || 0);

      // ===============================
      // Percentage change calculation
      // ===============================
      let percentage = "0.00%";
      if (prev6Total > 0) {
        const change = ((last6Total - prev6Total) / prev6Total) * 100;
        const sign = change >= 0 ? "+" : "-";
        percentage = `${sign}${Math.abs(change).toFixed(2)}%`;
      } else if (last6Total > 0) {
        percentage = "+100.00%";
      }

      // ===============================
      // Monthly spending (last 6 months)
      // ===============================
      const spendingQuery = `
        SELECT 
          TO_CHAR(created_at, 'Mon') AS month,
          EXTRACT(MONTH FROM created_at) AS month_number,
          SUM(total_price) AS total_spending
        FROM bookings
        WHERE renter_id = $1
          AND created_at BETWEEN $2 AND $3
          AND payment_status = 'paid'
          AND status = 'completed'
        GROUP BY month, month_number
        ORDER BY month_number ASC;
      `;

      const { rows: spending } = await pool.query(spendingQuery, [
        renterId,
        last6StartISO,
        last6EndISO,
      ]);

      const labels = spending.map((row) => row.month);
      const data = spending.map((row) => Number(row.total_spending));

      return res.json({
        labels,
        percentage,
        datasets: [
          {
            label: "Spending (PKR)",
            data,
            backgroundColor: "rgba(16, 183, 248, 1)",
            borderRadius: 50,
            barThickness: 20,
          },
        ],
      });
    } catch (error: any) {
      console.error("Error in getRenterSpending:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  }
}
