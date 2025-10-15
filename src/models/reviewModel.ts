import { pool } from "../config/db.js";
import { Review } from "../Interfaces/ReviewI";

export const reviewModel = {
  // ===============================
  // Create Review
  // ===============================
  async create(data: Review): Promise<Review> {
    const query = `
      INSERT INTO reviews (
        booking_id, rater_id, dealer_id, car_id, rating, comment
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      data.booking_id,
      data.rater_id,
      data.dealer_id,
      data.car_id,
      data.rating,
      data.comment ?? null,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ===============================
  // Get All Reviews
  // ===============================
  async getAll(): Promise<Review[]> {
    const { rows } = await pool.query(
      `SELECT * FROM reviews ORDER BY created_at DESC`
    );
    return rows;
  },

  // ===============================
  // Get Reviews by Car ID
  // ===============================
  async getByCar(carId: number): Promise<Review[]> {
    const { rows } = await pool.query(
      `SELECT * FROM reviews WHERE car_id = $1 ORDER BY created_at DESC`,
      [carId]
    );
    return rows;
  },

  // ===============================
  // Update Review
  // ===============================
  async update(id: number, data: Partial<Review>): Promise<Review | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return null;

    const setClause = fields.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const values = fields.map((key) => data[key as keyof Review]);

    const query = `
      UPDATE reviews
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0] || null;
  },

  // ===============================
  // Delete Review
  // ===============================
  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM reviews WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
