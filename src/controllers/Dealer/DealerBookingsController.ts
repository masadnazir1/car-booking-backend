import { Request, Response } from "express";
import CONSTANTS from "../../constants/consts.js";
import { DealerBookings } from "../../services/dealer/dealerBooking.Service.js";
import API_RES from "../../utils/resHandlers.ts/ApiRes.js";

export class DealerBookingsController {
  ERR_MSG = CONSTANTS.API_ERRORS.INTERNAL_SERVER_MSG;
  SERVER_ERR = CONSTANTS.API_ERRORS.INTERNAL_SERVER_ERR;
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
  async getBookingsDetails(req: Request, res: Response) {
    const { booking_id } = req.params;
    try {
      if (!booking_id) {
        return res.status(400).json({
          success: false,
          message: "booking_id, are required fileds",
        });
      }
      const booking: any = await DealerBookings.getBookingDetails(
        Number(booking_id)
      );

      if (!booking || booking.length === 0) {
        return res.json(
          new API_RES(
            true,
            404,
            "No booking details found for this id",
            booking,
            []
          )
        );
      }

      return res.json(
        new API_RES(
          true,
          200,
          "Booking details fetched successfully",
          booking,
          []
        )
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res
        .status(500)
        .json(new API_RES(false, 500, this.ERR_MSG, null, [this.SERVER_ERR]));
    }
  }
}
export { DealerBookings };
