import { Request, Response } from "express";
import Car from "../models/Car.js";
import Brand from "../models/Brand.js";
import Category from "../models/Category.js";

export default class CarController {
  constructor() {}

  //  Get all cars with full filter support
  public getAllCars = async (req: Request, res: Response) => {
    try {
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
        page = "1",
        limit = "10",
      } = req.query;

      const filter: Record<string, any> = {};

      // ---------- Filters ----------
      if (status && typeof status === "string") filter.status = status.trim();
      if (brandId && typeof brandId === "string") filter.brandId = brandId;
      if (categoryId && typeof categoryId === "string")
        filter.categoryId = categoryId;

      if (transmission && typeof transmission === "string")
        filter.transmission = transmission.trim();
      if (fuel && typeof fuel === "string") filter.fuel = fuel.trim();

      if (ac !== undefined) {
        if (ac === "true" || ac === "1") filter.ac = true;
        else if (ac === "false" || ac === "0") filter.ac = false;
      }

      if (year !== undefined) {
        const parsedYear = Number(year);
        if (!isNaN(parsedYear) && parsedYear > 1900) filter.year = parsedYear;
      }

      // ---------- Price filter ----------
      const minP = minPrice ? Number(minPrice) : undefined;
      const maxP = maxPrice ? Number(maxPrice) : undefined;

      if (
        (minP !== undefined && !isNaN(minP)) ||
        (maxP !== undefined && !isNaN(maxP))
      ) {
        filter.dailyRate = {};
        if (minP !== undefined && minP >= 0) filter.dailyRate.$gte = minP;
        if (maxP !== undefined && maxP >= 0) filter.dailyRate.$lte = maxP;
      }

      // ---------- Mileage filter ----------
      const minM = minMileage ? Number(minMileage) : undefined;
      const maxM = maxMileage ? Number(maxMileage) : undefined;

      if (
        (minM !== undefined && !isNaN(minM)) ||
        (maxM !== undefined && !isNaN(maxM))
      ) {
        filter.mileage = {};
        if (minM !== undefined && minM >= 0) filter.mileage.$gte = minM;
        if (maxM !== undefined && maxM >= 0) filter.mileage.$lte = maxM;
      }

      // ---------- Pagination ----------
      const parsedPage = Math.max(Number(page) || 1, 1);
      const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
      const skip = (parsedPage - 1) * parsedLimit;

      // ---------- Query execution ----------
      const [cars, totalCars] = await Promise.all([
        Car.find(filter)
          .skip(skip)
          .limit(parsedLimit)
          .populate("brandId categoryId dealerId"),
        Car.countDocuments(filter),
      ]);

      return res.status(200).json({
        message: "Cars fetched successfully",
        count: totalCars,
        page: parsedPage,
        limit: parsedLimit,
        cars,
      });
    } catch (error: any) {
      console.error("Error fetching cars:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //  Get single car by ID
  public getCarById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const car = await Car.findById(id).populate(
        "brandId categoryId dealerId"
      );

      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }

      return res.status(200).json({ car });
    } catch (error: any) {
      console.error("Error fetching car by ID:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //  Search cars by location
  public searchCarsByLocation = async (req: Request, res: Response) => {
    try {
      const { location } = req.params;
      if (!location) {
        return res.status(400).json({ error: "Location is required" });
      }

      const cars = await Car.find({
        location: { $regex: new RegExp(location, "i") },
      }).populate("brandId categoryId dealerId");

      if (!cars.length) {
        return res
          .status(404)
          .json({ message: "No cars found for this location" });
      }

      return res.status(200).json({ cars });
    } catch (error: any) {
      console.error("Error searching cars by location:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //  Get cars by categoryId
  public getCarsByCategory = async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      if (!categoryId) {
        return res.status(400).json({ error: "CategoryId is required" });
      }

      const cars = await Car.find({ categoryId }).populate(
        "brandId categoryId dealerId"
      );

      if (!cars.length) {
        return res
          .status(404)
          .json({ message: "No cars found in this category" });
      }

      return res.status(200).json({ cars });
    } catch (error: any) {
      console.error("Error fetching cars by category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //  Get cars within a price range
  public getCarsByPriceRange = async (req: Request, res: Response) => {
    try {
      const { min, max } = req.params;
      if (!min || !max) {
        return res
          .status(400)
          .json({ error: "Min and Max price are required" });
      }

      const cars = await Car.find({
        dailyRate: { $gte: Number(min), $lte: Number(max) },
      }).populate("brandId categoryId dealerId");

      if (!cars.length) {
        return res
          .status(404)
          .json({ message: "No cars found in this price range" });
      }

      return res.status(200).json({ cars });
    } catch (error: any) {
      console.error("Error fetching cars by price range:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  //  Add a car
  public addCar = async (req: Request, res: Response) => {
    try {
      const {
        dealerId,
        brandId,
        categoryId,
        name,
        description,
        images,
        badge,
        seats,
        doors,
        transmission,
        fuel,
        dailyRate,
        status,
        location,
        ac,
        year,
        mileage,
      } = req.body;

      if (
        !dealerId ||
        !brandId ||
        !categoryId ||
        !name ||
        !dailyRate ||
        !year
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify brand exists
      const brandExists = await Brand.findById(brandId);
      if (!brandExists) {
        return res.status(404).json({ message: "Brand not found" });
      }

      // Verify category exists
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }

      const car = await Car.create({
        dealerId,
        brandId,
        categoryId,
        name,
        description,
        images,
        badge,
        seats,
        doors,
        transmission,
        fuel,
        dailyRate,
        status,
        location,
        ac,
        year,
        mileage,
      });

      return res.status(201).json({
        message: "Car added successfully",
        car,
      });
    } catch (error: any) {
      console.error("Car creation error:", error);
      return res.status(500).json({ message: "Failed to add car" });
    }
  };
}
