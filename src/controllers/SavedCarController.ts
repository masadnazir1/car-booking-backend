import { Request, Response } from "express";
import { SavedCar } from "../models/SavedCar.js";
import Car from "../models/Car.js";
import mongoose from "mongoose";
export default class SavedCarController {
  constructor() {}

  // Save a car
  public saveCar = async (req: Request, res: Response) => {
    const { userId, carId } = req.body;
    try {
      // 1. Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid car ID format" });
      }

      // 2. Check if car exists
      const carExists = await Car.findById(carId);
      if (!carExists) {
        return res
          .status(404)
          .json({ success: false, message: "Car not found" });
      }

      // 3. Save
      const saved = new SavedCar({ userId, carId });
      await saved.save();

      return res
        .status(201)
        .json({ success: true, message: "Car saved", saved });
    } catch (error: any) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ success: false, message: "Car already saved" });
      }
      console.error("Save Car Error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // Remove saved car
  public removeSavedCar = async (req: Request, res: Response) => {
    const { userId, carId } = req.body;
    try {
      await SavedCar.findOneAndDelete({ userId, carId });

      return res.json({
        success: true,
        message: "Car removed from saved list",
      });
    } catch (error) {
      console.error("Remove Saved Car Error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // Get all saved cars for user
  public getSavedCars = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      //  Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID" });
      }

      //  Fetch saved cars with car + dealer populated
      const savedCars = await SavedCar.find({
        userId: new mongoose.Types.ObjectId(userId),
      })
        .populate({
          path: "carId",
          populate: { path: "dealerId", select: "fullName email phone status" },
        })
        .exec();

      //  Transform response into desired format
      const cars = savedCars.map((saved) => {
        const car: any = saved.carId;
        return {
          _id: car._id,
          dealerId: car.dealerId, // already populated
          name: car.name,
          category: car.category,
          description: car.description,
          images: car.images,
          badge: car.badge,
          seats: car.seats,
          doors: car.doors,
          transmission: car.transmission,
          fuel: car.fuel,
          dailyRate: car.dailyRate,
          location: car.location,
          year: car.year,
          mileage: car.mileage,
        };
      });

      return res.json({ success: true, cars });
    } catch (error) {
      console.error("Get Saved Cars Error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}
