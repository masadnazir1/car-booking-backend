import { pool } from "../../config/db.js";

export const DealerCustomerService = {
  async add(dealer_id: number, customer_id: number) {
    const query = `
      INSERT INTO dealer_customers (dealer_id, customer_id)
      VALUES ($1, $2)
      ON CONFLICT (dealer_id, customer_id) DO NOTHING
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [dealer_id, customer_id]);
    return rows[0] || null;
  },

  async getAll(dealer_id: number) {
    const query = `
      SELECT 
        u.id AS customer_id,
        u.full_name AS customer_name,
        u.email,
        u.phone,
        u.profile_image,
        u.address,
        dc.created_at AS added_at
      FROM dealer_customers dc
      JOIN users u ON u.id = dc.customer_id
      WHERE dc.dealer_id = $1
      ORDER BY dc.created_at DESC;
    `;
    const { rows } = await pool.query(query, [dealer_id]);
    return rows;
  },
};
