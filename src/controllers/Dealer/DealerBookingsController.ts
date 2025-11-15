import { DealerBookings } from "../../services/dealer/dealerBooking.Service.js";
import { Request, Response } from "express";

export class DealerBookingsController {
  constructor() {}

  //methos wil goes beloow here

  async getRecentBookings(req: Request, res: Response) {
    const { dealer_id } = req.params;
    try {
      console.log(typeof dealer_id);
      const recentBookings = await DealerBookings.getAll(Number(dealer_id));

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

  async getBookingsStatus(req: Request, res: Response) {
    const { dealer_id } = req.params;
    const { status } = req.query;
    try {
      console.log(dealer_id, status);
      if (!dealer_id || !status) {
        return res.status(400).json({
          success: false,
          message: "dealer_id, status are required fileds",
        });
      }
      const recentBookings = await DealerBookings.getByStatus(
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
export { DealerBookings };
