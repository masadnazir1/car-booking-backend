import { Request, Response } from "express";
import { savedCarModel } from "../models/savedCarModel.js";
import { CarModel } from "../models/carModel.js";

export default class SavedCarController {
  constructor() {}

  // ===============================
  // Save a Car
  // ===============================
  public saveCar = async (req: Request, res: Response) => {
    const { userId, carId } = req.body;

    try {
      // Validate required fields
      if (!userId || !carId) {
        return res.status(400).json({
          success: false,
          message: "userId and carId are required.",
        });
      }

      // Check if car exists
      const carExists = await CarModel.getById(carId);
      if (!carExists) {
        return res
          .status(404)
          .json({ success: false, message: "Car not found." });
      }

      // Save the car
      const saved = await savedCarModel.save(userId, carId);
      if (!saved) {
        return res.status(400).json({
          success: false,
          message: "Car already saved.",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Car saved successfully.",
        data: saved,
      });
    } catch (error) {
      console.error("Save Car Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while saving car.",
      });
    }
  };

  // ===============================
  // Remove Saved Car
  // ===============================
  public removeSavedCar = async (req: Request, res: Response) => {
    const { userId, carId } = req.body;

    try {
      if (!userId || !carId) {
        return res.status(400).json({
          success: false,
          message: "userId and carId are required.",
        });
      }

      const removed = await savedCarModel.remove(userId, carId);
      if (!removed) {
        return res.status(404).json({
          success: false,
          message: "Car not found in saved list.",
        });
      }

      return res.json({
        success: true,
        message: "Car removed from saved list.",
      });
    } catch (error) {
      console.error("Remove Saved Car Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while removing car.",
      });
    }
  };

  // ===============================
  // Get All Saved Cars for User
  // ===============================
  public getSavedCars = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required.",
        });
      }

      const savedCars = await savedCarModel.getByUser(Number(userId));
      if (!savedCars.length) {
        return res.status(404).json({
          success: false,
          message: "No saved cars found for this user.",
        });
      }

      return res.status(200).json({
        success: true,
        count: savedCars.length,
        data: savedCars,
      });
    } catch (error) {
      console.error("Get Saved Cars Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching saved cars.",
      });
    }
  };
}
