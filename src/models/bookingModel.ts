import { pool } from "../config/db.js";
import { Booking } from "../Interfaces/BookingI";
import { BookingDetail } from "../Interfaces/IBookingDetail.js";

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
  // Get Booking by ID
  // ===============================
  async getBookingDetails(booking_id: number): Promise<Booking | null> {
    const Query = `SELECT 
      -- BOOKINGS
      bk.id AS booking_id,
      bk.car_id,
      bk.renter_id,
      bk.dealer_id,
      bk.start_date,
      bk.end_date,
      bk.days,
      bk.total_price,
      bk.discount,
      bk.final_amount,
      bk.coupon_id,
      bk.status AS booking_status,
      bk.payment_status,
      bk.pickup_location,
      bk.dropoff_location,
      bk.isInvoiceGenerated,
      bk.created_at AS booking_created_at,
      bk.updated_at AS booking_updated_at,

      -- CARS
      c.id AS car_id,
      c.name AS car_name,
      c.description AS car_description,
      c.images AS car_images,
      c.badge AS car_badge,
      c.seats AS car_seats,
      c.doors AS car_doors,
      c.transmission AS car_transmission,
      c.fuel AS car_fuel,
      c.daily_rate AS car_daily_rate,
      c.status AS car_status,
      c.location AS car_location,
      c.ac AS car_ac,
      c.year AS car_year,
      c.mileage AS car_mileage,
      c.brand_id AS car_brand_id,
      c.category_id AS car_category_id,
      c.created_at AS car_created_at,
      c.updated_at AS car_updated_at,

      -- DEALER BUSINESS (LEFT JOIN)
      db.id AS business_id,
      db.business_name,
      db.logo_url,
      db.website_url,
      db.description AS business_description,
      db.established_year,
      db.registration_number,
      db.tax_id,
      db.address AS business_address,
      db.contact_email,
      db.contact_phone,
      db.status AS business_status,
      db.created_at AS business_created_at,
      db.updated_at AS business_updated_at,

      -- DEALER (USER)
      u.id AS dealer_user_id,
      u.full_name AS dealer_full_name,
      u.email AS dealer_email,
      u.phone AS dealer_phone,
      u.role AS dealer_role,
      u.profile_image AS dealer_profile_image,
      u.address AS dealer_address,
      u.status AS dealer_status,
      u.created_at AS dealer_created_at,
      u.updated_at AS dealer_updated_at

      FROM bookings bk
      JOIN cars c ON bk.car_id = c.id
      LEFT JOIN dealer_businesses db ON bk.dealer_id = db.user_id
      JOIN users u ON bk.dealer_id = u.id
      WHERE bk.id = $1
      LIMIT 1
    `;
    const { rows } = await pool.query(Query, [booking_id]);

    console.log(rows);

    if (!rows[0]) return null;

    const details: any = {
      bookingId: rows[0].booking_id,
      bookingDate: rows[0].booking_created_at,
      status: rows[0].booking_status,
      paymentStatus: rows[0].payment_status,
      totalAmount: rows[0].final_amount,

      car: {
        name: rows[0].car_name,
        make: rows[0].car_year,
        vehicleType: "car",
        bodyType: rows[0].car_category_id,
        fuel: rows[0].car_fuel,
        transmission: rows[0].car_transmission,
        ac: rows[0].car_ac,
        seats: rows[0].car_seats,
        doors: rows[0].car_doors,
        year: rows[0].car_year,
        mileage: rows[0].car_mileage,
        images: rows[0].car_images,
        dailyRate: rows[0].car_daily_rate,
      },

      rentalPeriod: {
        pickupDate: rows[0].start_date,
        returnDate: rows[0].end_date,
        pickupLocation: rows[0].pickup_location,
        returnLocation: rows[0].dropoff_location,
      },

      dealer: {
        name: rows[0].business_name || rows[0].dealer_full_name,
        phone: rows[0].contact_phone || rows[0].dealer_phone,
        email: rows[0].contact_email || rows[0].dealer_email,
        address: rows[0].business_address || rows[0].dealer_address,
        businessStatus: rows[0].business_status,
      },
    };

    return details || null;
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
