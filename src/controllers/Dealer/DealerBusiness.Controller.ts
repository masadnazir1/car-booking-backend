import { Request, Response } from "express";
import { BusinessDetailsSservice } from "../../services/dealer/BusinessDetails.service.js";
import { pool } from "../../config/db.js";
import fs from "fs";
import path from "path";
//
export default class DealerBusinessController {
  constructor() {}

  /**
   * getBusinessDetails
   */
  public async getBusinessDetails(req: Request, res: Response) {
    const { dealerId } = req.params;
    const BASE_URL = `${req.protocol}://${req.get("host")}`;

    try {
      if (!dealerId) {
        return res.status(400).json({
          success: false,
          message: "dealerId is required",
        });
      }

      const response = await BusinessDetailsSservice.getAll(Number(dealerId));

      const updatedResponse = response.map((item: any) => ({
        ...item,
        logo_url: item.logo_url ? `${BASE_URL}${item.logo_url}` : null,
      }));

      return res.status(200).json({
        success: true,
        data: updatedResponse,
      });
    } catch (err) {
      console.error("Error getting the business details:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * addBusinessDetails
   */
  public async addBusinessDetails(req: Request, res: Response) {
    console.log("Invoked add bus details");
    const {
      dealerId,
      business_name,
      website_url,
      description,
      established_year,
      registration_number,
      tax_id,
      address,
      contact_email,
      contact_phone,
    } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
      if (!dealerId) {
        return res
          .status(400)
          .json({ success: true, message: "dealerId is required" });
      }

      // Fetch dealer and brand names from DB
      const dealerResult = await pool.query(
        `SELECT business_name FROM dealer_businesses WHERE user_id=$1`,
        [dealerId]
      );

      const businessName = dealerResult.rows[0].business_name;

      // Define final folder
      const uploadFoder = path.join(process.cwd(), "Uploads");
      const finalFolder = path.join(
        uploadFoder,
        "DealersData",
        businessName,
        "businessDoc"
      );
      if (!fs.existsSync(finalFolder))
        fs.mkdirSync(finalFolder, { recursive: true });

      //define the doc
      let LogoUrl: any = null;

      if (files && files.length > 0) {
        files.forEach((file) => {
          const finalPath = path.join(finalFolder, file.filename);

          fs.renameSync(file.path, finalPath); // move the file

          LogoUrl = `/Uploads/DealersData/${businessName}/businessDoc/${file.filename}`;
        });
      }

      const response = await BusinessDetailsSservice.insertBusiness({
        user_id: dealerId,
        business_name,
        logo_url: LogoUrl,
        website_url,
        description,
        established_year,
        registration_number,
        tax_id,
        address,
        contact_email,
        contact_phone,
      });

      // Optional: clean up temp folder if empty
      const tempFolder = (req as any).tempFolder;
      if (tempFolder && fs.existsSync(tempFolder)) {
        fs.rmdirSync(tempFolder, { recursive: true });
      }

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (err) {
      console.error("Error getting the business details", err);
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
}
