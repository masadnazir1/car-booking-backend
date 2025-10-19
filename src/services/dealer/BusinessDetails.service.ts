import { pool } from "../../config/db.js";

export const BusinessDetailsSservice = {
  async getAll(dealer_id: number) {
    const res = await pool.query(
      `SELECT * FROM dealer_businesses WHERE user_id = $1`,
      [dealer_id]
    );
    return res.rows;
  },

  async insertBusiness(data: {
    user_id: number;
    business_name: string;
    logo_url?: string;
    website_url?: string;
    description?: string;
    established_year?: number;
    registration_number?: string;
    tax_id?: string;
    address?: object;
    contact_email?: string;
    contact_phone?: string;
    status?: "pending" | "approved" | "rejected";
  }) {
    const existing = await pool.query(
      `SELECT id FROM dealer_businesses WHERE user_id = $1`,
      [data.user_id]
    );

    if (existing && (existing.rowCount ?? 0) > 0) {
      const query = `
        UPDATE dealer_businesses SET
          business_name = $2,
          logo_url = $3,
          website_url = $4,
          description = $5,
          established_year = $6,
          registration_number = $7,
          tax_id = $8,
          address = $9,
          contact_email = $10,
          contact_phone = $11,
          status = COALESCE($12, status),
          updated_at = NOW()
        WHERE user_id = $1
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
        data.status || null,
      ];

      const res = await pool.query(query, values);
      return res.rows[0];
    } else {
      const insertQuery = `
        INSERT INTO dealer_businesses (
          user_id,
          business_name,
          logo_url,
          website_url,
          description,
          established_year,
          registration_number,
          tax_id,
          address,
          contact_email,
          contact_phone,
          status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($12, 'pending')
        )
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

      const res = await pool.query(insertQuery, values);
      return res.rows[0];
    }
  },
};
