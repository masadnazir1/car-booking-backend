import { pool } from "../config/db.js";
import { SavedCar } from "../Interfaces/SavedCarI";

export const savedCarModel = {
  // ===============================
  // Save a Car
  // ===============================
  async save(userId: number, carId: number): Promise<SavedCar | null> {
    const query = `
      INSERT INTO saved_cars (user_id, car_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, car_id) DO NOTHING
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, carId]);
    return rows[0] || null;
  },

  // ===============================
  // Get Saved Cars by User
  // ===============================
  async getByUser(userId: number): Promise<SavedCar[]> {
    const query = `
      SELECT sc.*, c.name AS car_name, c.images, c.daily_rate, c.status
      FROM saved_cars sc
      JOIN cars c ON sc.car_id = c.id
      WHERE sc.user_id = $1
      ORDER BY sc.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  // ===============================
  // Remove Saved Car
  // ===============================
  async remove(userId: number, carId: number): Promise<boolean> {
    const query = `DELETE FROM saved_cars WHERE user_id = $1 AND car_id = $2;`;
    const result = await pool.query(query, [userId, carId]);
    return (result.rowCount ?? 0) > 0;
  },

  // ===============================
  // Check if Car is Saved
  // ===============================
  async isSaved(userId: number, carId: number): Promise<boolean> {
    const query = `SELECT 1 FROM saved_cars WHERE user_id = $1 AND car_id = $2;`;
    const { rowCount } = await pool.query(query, [userId, carId]);
    return (rowCount ?? 0) > 0;
  },
};
