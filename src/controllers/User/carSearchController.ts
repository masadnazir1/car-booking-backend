import { Request, Response } from "express";
import { pool } from "../../config/db.js";

export default class CarSearchController {
  constructor() {}

  public searchCar = async (req: Request, res: Response) => {
    const keyword = req.query.q as string;
    const { page = "1", limit = "10" } = req.query;

    try {
      if (!keyword || keyword.trim().length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Keyword required" });
      }

      const parsedPage = Math.max(Number(page) || 1, 1);
      const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
      const offset = (parsedPage - 1) * parsedLimit;

      const likePattern = `%${keyword}%`;

      //  Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) AS total
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
      `;
      const countResult = await pool.query(countQuery, [likePattern]);
      const totalCount = Number(countResult.rows[0].total);
      const totalPages = Math.ceil(totalCount / parsedLimit);

      //  Get paginated results
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
        LIMIT $3 OFFSET $4
      `;

      const result = await pool.query(searchQuery, [
        likePattern,
        likePattern,
        parsedLimit,
        offset,
      ]);

      return res.status(200).json({
        success: true,
        pagination: {
          totalCount,
          totalPages,
          currentPage: parsedPage,
          limit: parsedLimit,
        },
        cars: result.rows,
      });
    } catch (error) {
      console.error("Car search error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
}
