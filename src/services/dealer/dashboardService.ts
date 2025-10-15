import { pool } from "../../config/db.js";

export const dealerdashboard = {
  async getMain(dealer_id: number) {
    //
    const totalCars = await pool.query(
      `SELECT * FROM cars WHERE dealer_id = $1`,
      [dealer_id]
    );
    const totalBookings = await pool.query(
      `SELECT * FROM bookings WHERE dealer_id = $1`,
      [dealer_id]
    );

    const totalEarnings = await pool.query(
      `
  SELECT 
    COALESCE(SUM(final_amount), 0) AS total_earnings
  FROM 
    bookings
  WHERE 
    dealer_id = $1
    AND status IN ('confirmed', 'completed')
    AND payment_status = 'paid'
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
  `,
      [dealer_id]
    );

    const pendingPayouts = await pool.query(
      `
  SELECT 
    COALESCE(SUM(final_amount), 0) AS pending_payouts
  FROM 
    bookings
  WHERE 
    dealer_id = $1
    AND status IN ('confirmed', 'completed')
    AND payment_status = 'unpaid'
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
  `,
      [dealer_id]
    );

    const pending = pendingPayouts.rows[0].pending_payouts;

    const total = totalEarnings.rows[0].total_earnings;

    const revenueStats = await pool.query(
      `
  WITH current_year AS (
    SELECT 
      DATE_TRUNC('month', created_at) AS month,
      SUM(final_amount) AS revenue
    FROM bookings
    WHERE 
      dealer_id = $1
      AND status = 'completed'
      AND payment_status = 'paid'
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY 1
    ORDER BY 1
  ),
  last_year AS (
    SELECT 
      DATE_TRUNC('month', created_at) AS month,
      SUM(final_amount) AS revenue
    FROM bookings
    WHERE 
      dealer_id = $1
      AND status = 'completed'
      AND payment_status = 'paid'
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) - 1
    GROUP BY 1
  )
  SELECT 
    TO_CHAR(c.month, 'Mon') AS month,
    COALESCE(c.revenue, 0) AS current_year_revenue,
    COALESCE(l.revenue, 0) AS last_year_revenue,
    ROUND(
      CASE 
        WHEN l.revenue > 0 THEN ((c.revenue - l.revenue) / l.revenue) * 100
        ELSE 0
      END, 2
    ) AS change_percent
  FROM generate_series(
    DATE_TRUNC('year', CURRENT_DATE),
    DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '11 months',
    INTERVAL '1 month'
  ) m(month)
  LEFT JOIN current_year c ON DATE_TRUNC('month', m.month) = DATE_TRUNC('month', c.month)
  LEFT JOIN last_year l ON DATE_TRUNC('month', m.month) = DATE_TRUNC('month', l.month)
  ORDER BY m.month;
  `,
      [dealer_id]
    );

    //
    //this month’s total revenue vs last month’s

    const monthComparison = await pool.query(
      `
  WITH current_month AS (
    SELECT 
      COALESCE(SUM(final_amount), 0) AS total
    FROM bookings
    WHERE 
      dealer_id = $1
      AND status = 'completed'
      AND payment_status = 'paid'
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
  ),
  last_month AS (
    SELECT 
      COALESCE(SUM(final_amount), 0) AS total
    FROM bookings
    WHERE 
      dealer_id = $1
      AND status = 'completed'
      AND payment_status = 'paid'
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  )
  SELECT 
    c.total AS current_month_revenue,
    l.total AS last_month_revenue,
    ROUND(
      CASE 
        WHEN l.total > 0 THEN ((c.total - l.total) / l.total) * 100
        ELSE 0
      END, 2
    ) AS change_percent
  FROM current_month c, last_month l;
  `,
      [dealer_id]
    );

    //return the response to the controller
    console.log("monthComparison", monthComparison.rows);

    return {
      totalCars: totalCars.rows.length,
      totalBookings: totalBookings.rows.length,
      totalEarnings: total,
      pendingPayouts: pending,
      monthly_change: monthComparison.rows,
      yearly_change:
        revenueStats.rows.length > 0
          ? revenueStats.rows.reduce((sum, r) => sum + r.change_percent, 0) /
            revenueStats.rows.length
          : 0,
      chart_data: revenueStats.rows,
    };
  },

  //Method to get the recent bookings for dashboard

  async RecentBookings(dealer_id: number) {
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
      LIMIT 5;
    `;

    const { rows } = await pool.query(query, [dealer_id]);
    return rows;
  },
};
