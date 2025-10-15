import { pool } from "../config/db";
import { UserCoupon } from "../Interfaces/UserCouponI";

export const userCouponModel = {
  // ===============================
  // Assign Coupon to User
  // ===============================
  async assign(
    userId: number,
    couponId: number,
    assignedBy?: number
  ): Promise<UserCoupon | null> {
    const query = `
      INSERT INTO user_coupons (user_id, coupon_id, assigned_by)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      userId,
      couponId,
      assignedBy ?? null,
    ]);
    return rows[0] || null;
  },

  // ===============================
  // Get All Coupons for a User
  // ===============================
  async getByUser(userId: number): Promise<UserCoupon[]> {
    const query = `
      SELECT uc.*, c.code, c.discount_type, c.discount_value, c.status
      FROM user_coupons uc
      JOIN coupons c ON uc.coupon_id = c.id
      WHERE uc.user_id = $1
      ORDER BY uc.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  // ===============================
  // Mark Coupon as Used
  // ===============================
  async markUsed(id: number): Promise<UserCoupon | null> {
    const query = `
      UPDATE user_coupons
      SET used = TRUE, used_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // ===============================
  // Delete User Coupon (Optional)
  // ===============================
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM user_coupons WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
