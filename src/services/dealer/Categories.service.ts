import { pool } from "../../config/db.js";

export const CategoriesService = {
  async getAll() {
    const res = await pool.query(
      `SELECT c.id ,c."name" AS category_name FROM categories c`
    );
    return res.rows;
  },
};
