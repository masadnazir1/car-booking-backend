import { pool } from "../config/db";
import { Coupon } from "../Interfaces/CouponI"; // define interface for Coupon
import { v4 as uuidv4 } from "uuid";

export const CouponModel = {
  // ===============================
  // Create a new coupon
  // ===============================
  async create(
    data: Omit<Coupon, "id" | "created_at" | "updated_at" | "used_by">
  ): Promise<Coupon> {
    const query = `
      INSERT INTO coupons (
        code, discount_type, discount_value, max_discount, min_booking_amount,
        applicable_categories, applicable_dealers, eligible_users,
        start_date, end_date, usage_limit, per_user_limit, status, created_by
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      ) RETURNING *;
    `;
    const values = [
      data.code.toUpperCase(),
      data.discount_type,
      data.discount_value,
      data.max_discount || null,
      data.min_booking_amount || 0,
      data.applicable_categories || null,
      data.applicable_dealers || null,
      data.eligible_users || null,
      data.start_date,
      data.end_date,
      data.usage_limit || 1,
      data.per_user_limit || 1,
      data.status || "active",
      data.created_by,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ===============================
  // Get coupon by ID
  // ===============================
  async getById(id: number): Promise<Coupon | null> {
    const query = `SELECT * FROM coupons WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // ===============================
  // Get coupon by code
  // ===============================
  async getByCode(code: string): Promise<Coupon | null> {
    const query = `SELECT * FROM coupons WHERE code = $1;`;
    const { rows } = await pool.query(query, [code.toUpperCase()]);
    return rows[0] || null;
  },

  // ===============================
  // List coupons with optional filters + pagination
  // ===============================
  async getAll(options: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ coupons: Coupon[]; total: number }> {
    const filters: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (options.status) {
      filters.push(`status = $${idx++}`);
      values.push(options.status);
    }

    const whereClause =
      filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const totalQuery = `SELECT COUNT(*) FROM coupons ${whereClause};`;
    const totalResult = await pool.query(totalQuery, values);
    const total = Number(totalResult.rows[0].count);

    const query = `
      SELECT * FROM coupons
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++};
    `;
    values.push(limit, offset);
    const { rows } = await pool.query(query, values);
    return { coupons: rows, total };
  },
};
