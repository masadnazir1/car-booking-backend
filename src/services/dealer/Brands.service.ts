import { pool } from "../../config/db.js";

export const BrandsSservice = {
  async getAll() {
    const res = await pool.query(
      `SELECT b.id ,b."name" AS brand_name FROM brands b`
    );
    return res.rows;
  },
};
