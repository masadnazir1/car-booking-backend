import { Request, Response } from "express";
import { pool } from "../../config/db.js";

export default class CarSearchController {
  constructor() {}

  /**
   * Search cars by keyword with maximum coverage:
   * - name / make / model
   * - description
   * - fuel type
   * - transmission
   * - location
   * - badge / variant
   */
  public searchCar = async (req: Request, res: Response) => {
    try {
      const keyword = req.query.q as string;

      if (!keyword || keyword.trim().length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Keyword required" });
      }

      const searchQuery = `
        SELECT *
        FROM cars
        WHERE 
          name ILIKE $1
          OR description ILIKE $1
          OR fuel ILIKE $1
          OR transmission ILIKE $1
          OR location ILIKE $1
          OR badge ILIKE $1
          OR CAST(seats AS TEXT) ILIKE $1
          OR CAST(doors AS TEXT) ILIKE $1
        ORDER BY
          CASE 
            WHEN name ILIKE $2 THEN 1
            WHEN description ILIKE $2 THEN 2
            WHEN location ILIKE $2 THEN 3
            ELSE 4
          END,
          created_at DESC
        LIMIT 50;
      `;

      const likePattern = `%${keyword}%`;

      const result = await pool.query(searchQuery, [likePattern, likePattern]);

      if (!result.rows.length) {
        return res
          .status(404)
          .json({ success: false, message: "No cars found" });
      }

      return res.status(200).json({ success: true, cars: result.rows });
    } catch (error) {
      console.error("Car search error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
}
