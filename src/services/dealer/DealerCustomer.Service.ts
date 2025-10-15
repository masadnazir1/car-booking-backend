import { pool } from "../../config/db.js";

export const DealerCustomer = {
  async getAll(dealer_id: number, status: string = "active") {
    const query = `
         SELECT 
        u.id AS customer_id,
        u.email  AS email,
        u.full_name AS customer_name,
         u.phone  AS customer_phone ,
        u.profile_image as customer_profile_image,
        u.address as customer_address
      
      FROM 
        bookings b
      JOIN 
        users u ON b.renter_id = u.id
      WHERE 
        b.dealer_id = $1
      ORDER BY 
        b.created_at DESC
    `;

    const { rows } = await pool.query(query, [dealer_id]);
    return rows;
  },
};
