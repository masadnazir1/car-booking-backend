import { pool } from "../config/db.js";
import { Category } from "../Interfaces/CategoryI";

export const CategoryModel = {
  // ===============================
  // Create Category
  // ===============================
  async create(
    data: Omit<Category, "id" | "created_at" | "updated_at">
  ): Promise<Category> {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [data.name, data.description || null];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ===============================
  // Get All Categories
  // ===============================
  async getAll(): Promise<Category[]> {
    const query = `SELECT * FROM categories ORDER BY name ASC;`;
    const { rows } = await pool.query(query);
    return rows;
  },

  // ===============================
  // Get Category by ID
  // ===============================
  async getById(id: number): Promise<Category | null> {
    const query = `SELECT * FROM categories WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // ===============================
  // Update Category
  // ===============================
  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return null;

    const setClause = fields.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const values = fields.map((key) => (data as any)[key]);

    const query = `
      UPDATE categories
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0] || null;
  },

  // ===============================
  // Delete Category
  // ===============================
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM categories WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
