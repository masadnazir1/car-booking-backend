import { Request, Response } from "express";
import { dealerdashboard } from "../../services/dealer/dashboardService.js";

export default class DealerController {
  constructor() {}

  //method to get the data for dashboard main boxes
  public getMainStats = async (req: Request, res: Response) => {
    const { Dealer_id } = req.params;

    try {
      //check the dealer id
      if (!Dealer_id) {
        return res
          .status(400)
          .json({ Success: false, message: "Dealer id is missing!" });
      }

      //proccess the req
      const response = await dealerdashboard.getMain(Number(Dealer_id));
      if (response) {
        res.status(200).json({
          muccess: true,
          message: "Date feteched successfully",
          data: response,
        });
      } else {
        res.status(404).json({
          Success: false,
          message: "No date  found for this dealer",
        });
      }
    } catch (error: any) {
      console.error("Error getting the dashboard", error);
      res
        .status(500)
        .json({ Success: false, message: "Something went wrong!" });
    }
  };

  //endpoint to get the recent bookings

  async getRecentBookings(req: Request, res: Response) {
    try {
      const { dealer_id } = req.params;
      const recentBookings = await dealerdashboard.RecentBookings(
        Number(dealer_id)
      );

      return res.json({
        success: true,
        data: recentBookings,
      });
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch recent bookings",
      });
    }
  }
}
