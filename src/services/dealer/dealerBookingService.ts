import { pool } from "../../config/db.js";

export const DealerBookings = {
  async getAll(dealer_id: number) {
    const query = `
      SELECT 
        b.id AS booking_id,
        c.name AS vehicle,
        u.full_name AS customer,
        b.status,
        TO_CHAR(b.start_date, 'YYYY-MM-DD') AS start_date,
        TO_CHAR(b.end_date, 'YYYY-MM-DD') AS end_date,
        b.final_amount AS amount
      FROM 
        bookings b
      JOIN 
        cars c ON b.car_id = c.id
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
  async getByStatus(dealer_id: number, status: string) {
    const query = `
      SELECT 
        b.id AS booking_id,
        c.name AS vehicle,
        u.full_name AS customer,
        b.status,
        TO_CHAR(b.start_date, 'YYYY-MM-DD') AS start_date,
        TO_CHAR(b.end_date, 'YYYY-MM-DD') AS end_date,
        b.final_amount AS amount
      FROM 
        bookings b
      JOIN 
        cars c ON b.car_id = c.id
      JOIN 
        users u ON b.renter_id = u.id
      WHERE 
        b.dealer_id = $1
      AND 
      b.status=$2    
     
      ORDER BY 
        b.created_at DESC
    `;

    const { rows } = await pool.query(query, [dealer_id, status]);
    return rows;
  },
};
