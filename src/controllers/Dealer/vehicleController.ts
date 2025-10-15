import { Request, Response } from "express";
import { vehicleService } from "../../services/dealer/vehicleService.js";
import { pool } from "../../config/db.js";
import fs from "fs";
import path from "path";

//
//
export default class VehicleController {
  constructor() {}

  public getVehicles = async (req: Request, res: Response) => {
    const { Dealer_id } = req.params;

    try {
      if (!Dealer_id) {
        res
          .status(400)
          .json({ Success: false, message: "Dealer id is missing!" });
      }

      //proccess the req
      const response = await vehicleService.getAllVehicles(Number(Dealer_id));
      if (response.length > 0) {
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
      res
        .status(500)
        .json({ Success: false, message: "Something went wrong!", error });
    }
  };

  //
  /**
   * addVehicles
   */
  //
  public addVehicles = async (req: Request, res: Response) => {
    try {
      const {
        dealer_id,
        brand_id,
        carName,
        category_id,
        description,
        badge,
        doors,
        seats,
        transmission,
        location,
        fuel,
        ac,
        year,
        mileage,
        status,
      } = req.body;
      const files = req.files as Express.Multer.File[];
      const { daily_rate } = req.body;

      console.log("data", daily_rate);
      // Validate uploaded files
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      if (!dealer_id || !brand_id) {
        return res
          .status(400)
          .json({ error: "Dealer_id and brand_id required" });
      }

      // Fetch dealer and brand names from DB
      const dealerResult = await pool.query(
        `SELECT business_name FROM dealer_businesses WHERE user_id=$1`,
        [dealer_id]
      );
      const brandResult = await pool.query(
        `SELECT name FROM brands WHERE id=$1`,
        [brand_id]
      );

      if (!dealerResult.rows.length || !brandResult.rows.length) {
        return res.status(404).json({ error: "Dealer or Brand not found" });
      }

      const businessName = dealerResult.rows[0].business_name;
      const brandName = brandResult.rows[0].name;

      // Define final folder
      const finalFolder = path.join(
        process.cwd(),
        "DealersData",
        businessName,
        brandName
      );
      if (!fs.existsSync(finalFolder))
        fs.mkdirSync(finalFolder, { recursive: true });

      // Move uploaded files from temp to final folder
      const imageUrls: string[] = [];
      files.forEach((file) => {
        const finalPath = path.join(finalFolder, file.filename);
        fs.renameSync(file.path, finalPath); // move file
        imageUrls.push(
          `/DealersData/${businessName}/${brandName}/${file.filename}`
        );
      });

      // Optional: clean up temp folder if empty
      const tempFolder = (req as any).tempFolder;
      if (tempFolder && fs.existsSync(tempFolder)) {
        fs.rmdirSync(tempFolder, { recursive: true });
      }
      const dataPayload = {
        images: imageUrls,
        dealer_id: dealer_id,
        brand_id: brand_id,
        name: carName,
        category_id: category_id,
        description: description,
        badge: badge,
        doors: doors,
        seats: seats,
        transmission: transmission,
        fuel: fuel,
        daily_rate: daily_rate,
        status: status,
        location: location,
        ac: ac,
        year: year,
        mileage: mileage,
      };

      //now add the data in the db via service
      const response = await vehicleService.addVehicle(dataPayload);

      res.status(201).json({
        success: true,
        message: "Files uploaded and moved successfully",
        data: response,
      });
    } catch (error: any) {
      console.error("Error in addVehicles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
