import { Request, Response } from "express";
import { CarModel } from "../models/carModel.js";

export default class CarController {
  constructor() {}

  // Get all cars with filters + pagination
  public getAllCars = async (req: Request, res: Response) => {
    const {
      status,
      brandId,
      categoryId,
      transmission,
      fuel,
      ac,
      year,
      minPrice,
      maxPrice,
      minMileage,
      maxMileage,
      location,
      page = "1",
      limit = "10",
    } = req.query;

    //
    console.log("HOST", req.hostname, req.socket.localPort);

    let baseUrl = "";
    //get the base url for maping the pictures
    if (req.hostname === "localhost") {
      baseUrl = `${req.protocol}://${req.hostname}:${req.socket.localPort}`;
      console.log("baseUrl", baseUrl);
    } else if (req.hostname !== "localhost") {
      baseUrl = `http://${req.hostname}`;
    }
    //end of contruction
    try {
      // Prepare filters
      const filters: Record<string, any> = {};

      if (status) filters.status = status;
      if (brandId) filters.brand_id = Number(brandId);
      if (categoryId) filters.category_id = Number(categoryId);
      if (transmission) filters.transmission = transmission;
      if (fuel) filters.fuel = fuel;
      if (ac !== undefined) filters.ac = ac === "true" || ac === "1";
      if (year) filters.year = Number(year);

      if (minPrice || maxPrice) {
        filters.daily_rate = {};
        if (minPrice) filters.daily_rate.$gte = Number(minPrice);
        if (maxPrice) filters.daily_rate.$lte = Number(maxPrice);
      }

      if (minMileage || maxMileage) {
        filters.mileage = {};
        if (minMileage) filters.mileage.$gte = Number(minMileage);
        if (maxMileage) filters.mileage.$lte = Number(maxMileage);
      }

      const parsedPage = Math.max(Number(page) || 1, 1);
      const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
      const offset = (parsedPage - 1) * parsedLimit;

      const { rows: cars, count: totalCars } = await CarModel.getAll(
        filters,
        location as string,
        parsedLimit,
        offset
      );

      // Format the data
      const formattedCars = cars.map((car) => ({
        ...car,
        images: (car.images || []).map((img) =>
          img.startsWith("http") ? img : `${baseUrl}${img}`
        ),
      }));

      return res.status(200).json({
        success: true,
        message: "Cars fetched successfully",
        count: totalCars,
        page: parsedPage,
        limit: parsedLimit,
        cars: formattedCars,
      });
    } catch (error: any) {
      console.error("Error fetching cars:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  };

  // Get single car by ID
  public getCarById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const car = await CarModel.getById(Number(id));

      if (!car)
        return res
          .status(404)
          .json({ success: false, message: "Car not found" });

      return res.status(200).json({ success: true, car });
    } catch (error: any) {
      console.error("Error fetching car by ID:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  };
}
