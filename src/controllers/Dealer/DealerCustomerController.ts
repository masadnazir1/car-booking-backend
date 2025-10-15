import { DealerCustomer } from "../../services/dealer/DealerCustomer.Service.js";
import { Request, Response } from "express";

export class DealerCustomerController {
  constructor() {}

  //methos wil goes beloow here

  async getAllCustomers(req: Request, res: Response) {
    try {
      const { dealer_id } = req.params;
      console.log(typeof dealer_id);
      const recentBookings = await DealerCustomer.getAll(Number(dealer_id));

      return res.json({
        success: true,
        data: recentBookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch  bookings",
      });
    }
  }

  async getCustomersStatus(req: Request, res: Response) {
    try {
      const { dealer_id } = req.params;
      const { status } = req.query;

      console.log(dealer_id, status);
      if (!dealer_id || !status) {
        return res.status(400).json({
          success: false,
          message: "dealer_id, status are required fileds",
        });
      }
      const recentBookings = await DealerCustomer.getAll(
        Number(dealer_id),
        status?.toString()
      );

      return res.json({
        success: true,
        data: recentBookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch  bookings",
      });
    }
  }
}
