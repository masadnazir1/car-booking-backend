import { DealerCustomerService } from "../../services/dealer/DealerCustomer.Service.js";
import { Request, Response } from "express";
import { pool } from "../../config/db.js";

export class DealerCustomerController {
  constructor() {}

  // Get all customers linked with a dealer
  async getAllCustomers(req: Request, res: Response) {
    try {
      const { dealer_id } = req.params;
      const recentBookings = await DealerCustomerService.getAll(
        Number(dealer_id)
      );

      return res.json({
        success: true,
        data: recentBookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch bookings",
      });
    }
  }

  // Dealer adds new customer (even if customer has no account)
  async addCustomer(req: Request, res: Response) {
    try {
      const { dealerId, full_name, email, phone, address } = req.body;

      if (!dealerId || !email || !full_name) {
        return res.status(400).json({
          success: false,
          message: "dealerId, full_name, and email are required",
        });
      }

      // Check if dealer exists and is actually a dealer
      const dealerCheck = await pool.query(
        `SELECT id FROM users WHERE id = $1 AND role = 'dealer' AND status = 'active' LIMIT 1`,
        [dealerId]
      );
      if (dealerCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Dealer not found or inactive",
        });
      }

      // Check if user already exists
      const existing = await pool.query(
        `SELECT id FROM users WHERE email = $1 OR phone = $2 LIMIT 1`,
        [email, phone || null]
      );

      let customerId;
      if (existing.rows.length > 0) {
        customerId = existing.rows[0].id;
      } else {
        // Create a minimal renter profile with invited status
        const inserted = await pool.query(
          `INSERT INTO users (full_name, email, phone, address, role, status)
         VALUES ($1, $2, $3, $4::jsonb, 'renter', 'invited')
         RETURNING id`,
          [
            full_name,
            email,
            phone || null,
            address ? JSON.stringify(address) : JSON.stringify({}),
          ]
        );
        customerId = inserted.rows[0].id;
      }

      // Create dealer-customer link
      const link = await pool.query(
        `INSERT INTO dealer_customers (dealer_id, customer_id)
       VALUES ($1, $2)
       ON CONFLICT (dealer_id, customer_id) DO NOTHING
       RETURNING *`,
        [dealerId, customerId]
      );

      return res.status(200).json({
        success: true,
        message: link.rows.length
          ? "Customer added successfully"
          : "Customer already linked",
        customer_id: customerId,
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
