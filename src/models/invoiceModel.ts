import { pool } from "../config/db";
import Invoice from "../Interfaces/Invoice";

export const InvoiceModel = {
  // ===============================
  // Create Invoice
  // ===============================
  async create(
    data: Omit<Invoice, "id" | "created_at" | "updated_at">
  ): Promise<Invoice> {
    const query = `
      INSERT INTO invoices (
        booking_id, dealer_generating, generated_for,
        invoice_number, issue_date, payment_id, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      data.booking_id,
      data.dealer_generating,
      data.generated_for,
      data.invoice_number,
      data.issue_date || new Date(),
      data.payment_id || null,
      data.notes || null,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ===============================
  // Get All Invoices
  // ===============================
  async getAll(): Promise<Invoice[]> {
    const query = `SELECT * FROM invoices ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query);
    return rows;
  },

  // ===============================
  // Get Invoice by ID
  // ===============================
  async getById(id: number): Promise<Invoice | null> {
    const query = `SELECT * FROM invoices WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // ===============================
  // Get Invoices by Dealer ID
  // ===============================
  async getByDealer(dealerId: number): Promise<Invoice[]> {
    const query = `
      SELECT * FROM invoices
      WHERE dealer_generating = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [dealerId]);
    return rows;
  },

  // ===============================
  // Get Invoices by Customer (Generated For)
  // ===============================
  async getByCustomer(customerId: number): Promise<Invoice[]> {
    const query = `
      SELECT * FROM invoices
      WHERE generated_for = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [customerId]);
    return rows;
  },

  // ===============================
  // Update Invoice
  // ===============================
  async update(id: number, data: Partial<Invoice>): Promise<Invoice | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return null;

    const setClause = fields.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const values = fields.map((key) => (data as any)[key]);

    const query = `
      UPDATE invoices
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0] || null;
  },

  // ===============================
  // Delete Invoice
  // ===============================
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM invoices WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
