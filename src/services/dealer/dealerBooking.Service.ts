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
  async getBookingDetails(booking_id: number) {
    const query = `
    SELECT
      b.id AS booking_id,
      b.car_id AS booking_car_id,
      b.renter_id AS booking_renter_id,
      b.dealer_id AS booking_dealer_id,
      b.start_date AS booking_start_date,
      b.end_date AS booking_end_date,
      b.days AS booking_days,
      b.total_price AS booking_total_price,
      b.discount AS booking_discount,
      b.final_amount AS booking_final_amount,
      b.status AS booking_status,
      b.payment_status AS booking_payment_status,
      b.pickup_location AS booking_pickup_location,
      b.dropoff_location AS booking_dropoff_location,
      b.created_at AS booking_created_at,
      b.updated_at AS booking_updated_at,

      u.id AS renter_id,
      u.full_name AS renter_name,
      u.email AS renter_email,
      u.phone AS renter_phone,
      u.profile_image AS renter_profile_image,

      c.id AS car_id,
      c.name AS car_name,
      c.brand_id AS car_brand_id,
      c.category_id AS car_category_id,
      c.images AS car_images,
      c.daily_rate AS car_daily_rate,
      c.status AS car_status,
      c.location AS car_location,
      c.year AS car_year
    FROM bookings b
    JOIN users u ON b.renter_id = u.id
    JOIN cars c ON b.car_id = c.id
    WHERE b.id = $1
  `;

    const { rows } = await pool.query(query, [booking_id]);
    if (!rows.length) return null;

    const r = rows[0];

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
    const row = rows[0];

    const images: any = Array.isArray(row.car_images)
      ? row.car_images.map((i: string) => BASE_URL + i)
      : [];

    return {
      booking: {
        id: r.booking_id,
        car_id: r.booking_car_id,
        renter_id: r.booking_renter_id,
        dealer_id: r.booking_dealer_id,
        start_date: r.booking_start_date,
        end_date: r.booking_end_date,
        days: r.booking_days,
        total_price: r.booking_total_price,
        discount: r.booking_discount,
        final_amount: r.booking_final_amount,
        status: r.booking_status,
        payment_status: r.booking_payment_status,
        pickup_location: r.booking_pickup_location,
        dropoff_location: r.booking_dropoff_location,
        created_at: r.booking_created_at,
        updated_at: r.booking_updated_at,
      },
      renter: {
        id: r.renter_id,
        name: r.renter_name,
        email: r.renter_email,
        phone: r.renter_phone,
        profile_image: r.renter_profile_image,
      },
      car: {
        id: r.car_id,
        name: r.car_name,
        brand_id: r.car_brand_id,
        category_id: r.car_category_id,
        images,
        daily_rate: r.car_daily_rate,
        status: r.car_status,
        location: r.car_location,
        year: r.car_year,
      },
    };
  },
};
