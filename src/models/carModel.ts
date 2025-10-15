import { pool } from "../config/db.js";
import { Car } from "../Interfaces/CarI";

export const CarModel = {
  // ===============================
  // Create Car
  // ===============================
  async create(
    data: Omit<Car, "id" | "created_at" | "updated_at">
  ): Promise<Car> {
    //
    //
    console.log("data ADD", data);
    //
    //
    const query = `
      INSERT INTO cars (
        dealer_id, brand_id, category_id, name, description, images,
        badge, seats, doors, transmission, fuel, daily_rate,
        status, location, ac, year, mileage
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17
      )
      RETURNING *;
    `;

    const values = [
      data.dealer_id,
      data.brand_id,
      data.category_id,
      data.name,
      data.description || null,
      data.images || [],
      data.badge || null,
      data.seats || null,
      data.doors || null,
      data.transmission || null,
      data.fuel || null,
      data.daily_rate,
      data.status || "available",
      data.location || null,
      data.ac ?? true,
      data.year,
      data.mileage || 0,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ===============================
  // Get All Cars with filters + pagination
  // ===============================
  async getAll(
    filters?: Partial<Car>,
    location?: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ rows: Car[]; count: number }> {
    const conditions: string[] = [];
    const values: any[] = [];

    let idx = 1;

    // Filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "daily_rate" || key === "mileage") {
            if ((value as any).$gte !== undefined) {
              conditions.push(`${key} >= $${idx++}`);
              values.push((value as any).$gte);
            }
            if ((value as any).$lte !== undefined) {
              conditions.push(`${key} <= $${idx++}`);
              values.push((value as any).$lte);
            }
          } else {
            conditions.push(`${key} = $${idx++}`);
            values.push(value);
          }
        }
      });
    }

    // Location search (ILIKE)
    if (location) {
      conditions.push(`location ILIKE $${idx++}`);
      values.push(`%${location}%`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM cars ${whereClause};`;
    const countResult = await pool.query(countQuery, values);
    const count = Number(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM cars
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++};
    `;
    const dataValues = [...values, limit, offset];
    const { rows } = await pool.query(dataQuery, dataValues);

    return { rows, count };
  },

  // ===============================
  // Get Car by ID
  // ===============================
  async getById(id: number): Promise<Car | null> {
    const query = `SELECT * FROM cars WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // ===============================
  // Update Car
  // ===============================
  async update(id: number, data: Partial<Car>): Promise<Car | null> {
    const fields = Object.keys(data);
    if (!fields.length) return null;

    const setClause = fields.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const values = fields.map((key) =>
      key === "images"
        ? (data[key as keyof Car] as string[]) || []
        : (data[key as keyof Car] as any)
    );

    const query = `
      UPDATE cars
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0] || null;
  },

  // ===============================
  // Delete Car
  // ===============================
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM cars WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
