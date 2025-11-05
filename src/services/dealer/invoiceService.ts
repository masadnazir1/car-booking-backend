import { pool } from "../../config/db.js";

export const InvoiceServ = {
  async generateInvoice(booking_id: number) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM bookings WHERE id = $1",
        [booking_id]
      );
      const booking = rows[0];
      if (!booking) throw new Error("Booking not found");

      const existingInvoice = await pool.query(
        "SELECT * FROM invoices WHERE booking_id = $1",
        [booking_id]
      );
      if (existingInvoice.rows.length > 0) {
        // if invoice is created then return the invoice details using the getInvoice service function
        const invoiceDetails = await this.getInvoice(booking_id);
        return invoiceDetails;
      }

      const invoiceNumber = `INV-${booking_id}-${Date.now()}`;

      const insertQuery = `
        INSERT INTO invoices (
          booking_id,
          dealer_generating,
          generated_for,
          invoice_number,
          notes
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const { rows: invoiceRows } = await pool.query(insertQuery, [
        booking.id,
        booking.dealer_id,
        booking.renter_id,
        invoiceNumber,
        `Invoice for booking ${booking.id}`,
      ]);

      const invoice = invoiceRows[0];

      if (invoice) {
        await pool.query(
          "UPDATE bookings SET isInvoiceGenerated = true WHERE id = $1",
          [booking.id]
        );
        console.log("Updated bookings table");
        const invoiceDetails = await this.getInvoice(booking_id);
        return invoiceDetails;
      }

      return invoice;
    } catch (error) {
      console.error("Error generating invoice:", error);
      throw error;
    }
  },

  async getInvoice(booking_id: number) {
    const { rows } = await pool.query(
      `
      SELECT i.invoice_number, i.issue_date , b.* , db.*, c.* FROM invoices i join bookings b ON i.booking_id = b.id join dealer_businesses db on b.dealer_id = db.user_id join cars c on b.car_id = c.id where i.booking_id = $1
      `,
      [booking_id]
    );
    return rows[0];
  },
};
