import { pool } from "../config/db.js";
import { User } from "../Interfaces/UserI.js";

export const UserModel = {
  //  Create new user
  async create(user: User) {
    const { rows } = await pool.query(
      `
      INSERT INTO users 
      (full_name, email, phone, role, password_hash, social_login, profile_image, address, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
      `,
      [
        user.full_name,
        user.email,
        user.phone,
        user.role,
        user.password_hash || null,
        user.social_login ? JSON.stringify(user.social_login) : null,
        user.profile_image || null,
        user.address ? JSON.stringify(user.address) : null,
        user.status || "active",
      ]
    );
    return rows[0];
  },

  //  Find user by email
  async findByEmail(email: string) {
    console.log("EMAIL", email);
    const { rows } = await pool.query(
      "SELECT * FROM public.users WHERE email = $1",
      [email]
    );
    return rows[0];
  },

  //  Find user by phone
  async findByPhone(phone: string) {
    const { rows } = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    return rows[0];
  },

  //  Find user by ID
  async findById(id: number) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0];
  },

  //  Update password
  async updatePassword(id: number, hash: string) {
    const { rows } = await pool.query(
      `UPDATE users 
       SET password_hash = $1, reset_password_token = NULL, reset_password_expire = NULL, updated_at = NOW()
       WHERE id = $2 RETURNING *;`,
      [hash, id]
    );
    return rows[0];
  },

  //  Set reset password token
  async setResetToken(email: string, token: string, expire: number) {
    await pool.query(
      `
      UPDATE users 
      SET reset_password_token = $1, reset_password_expire = $2, updated_at = NOW()
      WHERE email = $3;
      `,
      [token, expire, email]
    );
  },

  //  Find user by reset token
  async findByResetToken(token: string) {
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE reset_password_token = $1
      AND reset_password_expire > EXTRACT(EPOCH FROM NOW()) * 1000;
      `,
      [token]
    );
    return rows[0];
  },

  //  Update profile details
  async updateProfile(id: number, data: Partial<User>) {
    const { rows } = await pool.query(
      `
      UPDATE users
      SET
        full_name = COALESCE($1, full_name),
        profile_image = COALESCE($2, profile_image),
        address = COALESCE($3, address),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *;
      `,
      [
        data.full_name || null,
        data.profile_image || null,
        data.address ? JSON.stringify(data.address) : null,
        id,
      ]
    );
    return rows[0];
  },

  //  Deactivate / suspend / delete user
  async updateStatus(id: number, status: "active" | "suspended" | "deleted") {
    const { rows } = await pool.query(
      `UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;`,
      [status, id]
    );
    return rows[0];
  },
};
