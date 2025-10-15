import { pool } from "../config/db.js";
import { DealerBusiness } from "../Interfaces/DealerBusinessI.js";

export const DealerBusinessModel = {
  // ===============================
  // Create Dealer Business
  // ===============================
  async create(data: DealerBusiness): Promise<DealerBusiness> {
    const query = `
      INSERT INTO dealer_businesses (
        user_id, business_name, logo_url, website_url, description,
        established_year, registration_number, tax_id, address,
        contact_email, contact_phone, status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *;
    `;
    const values = [
      data.user_id,
      data.business_name,
      data.logo_url || null,
      data.website_url || null,
      data.description || null,
      data.established_year || null,
      data.registration_number || null,
      data.tax_id || null,
      data.address ? JSON.stringify(data.address) : null,
      data.contact_email || null,
      data.contact_phone || null,
      data.status || "pending",
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ===============================
  // Find By Dealer (User ID)
  // ===============================
  async findByUserId(userId: number): Promise<DealerBusiness | null> {
    const query = `SELECT * FROM dealer_businesses WHERE user_id = $1 LIMIT 1;`;
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
  },

  // ===============================
  // Get All Businesses (Admin View)
  // ===============================
  async findAll(): Promise<DealerBusiness[]> {
    const query = `SELECT * FROM dealer_businesses ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query);
    return rows;
  },

  // ===============================
  // Update Business Info
  // ===============================
  async update(
    id: number,
    data: Partial<DealerBusiness>
  ): Promise<DealerBusiness | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return null;

    const setClause = fields.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const values = fields.map((key) =>
      key === "address" ? JSON.stringify(data[key]) : ""
    );

    const query = `
      UPDATE dealer_businesses
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0] || null;
  },

  // ===============================
  // Delete Business
  // ===============================
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM dealer_businesses WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
