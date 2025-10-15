import { pool } from "../config/db";
import { Booking } from "../Interfaces/BookingI";

export const BookingModel = {
  // ===============================
  // Create Booking
  // ===============================
  async create(
    data: Omit<Booking, "id" | "created_at" | "updated_at">
  ): Promise<Booking> {
    const query = `
      INSERT INTO bookings (
        car_id, renter_id, dealer_id, start_date, end_date, days,
        total_price, discount, final_amount, coupon_id,
        status, payment_status, pickup_location, dropoff_location
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14
      )
      RETURNING *;
    `;

    const values = [
      data.car_id,
      data.renter_id,
      data.dealer_id,
      data.start_date,
      data.end_date,
      data.days,
      data.total_price,
      data.discount || 0,
      data.final_amount,
      data.coupon_id || null,
      data.status || "pending",
      data.payment_status || "unpaid",
      data.pickup_location,
      data.dropoff_location,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ===============================
  // Get All Bookings
  // ===============================
  async getAll(): Promise<Booking[]> {
    const query = `SELECT * FROM bookings ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query);
    return rows;
  },

  // ===============================
  // Get Booking by ID
  // ===============================
  async getById(id: number): Promise<Booking | null> {
    const query = `SELECT * FROM bookings WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // ===============================
  // Get Bookings by Dealer ID
  // ===============================
  async getByDealer(dealerId: number): Promise<Booking[]> {
    const query = `
      SELECT * FROM bookings
      WHERE dealer_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [dealerId]);
    return rows;
  },

  // ===============================
  // Get Bookings by Renter ID
  // ===============================
  async getByRenter(renterId: number): Promise<Booking[]> {
    const query = `
      SELECT * FROM bookings
      WHERE renter_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [renterId]);
    return rows;
  },

  // ===============================
  // Update Booking
  // ===============================
  async update(id: number, data: Partial<Booking>): Promise<Booking | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return null;

    const setClause = fields.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const values = fields.map((key) => (data as any)[key]);

    const query = `
      UPDATE bookings
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0] || null;
  },

  // ===============================
  // Delete Booking
  // ===============================
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM bookings WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
