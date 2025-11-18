import { pool } from "../../config/db.js";
import { DealerReview } from "../../Interfaces/DealerReviewI.js";

export const DealerReviewsService = {
  async getDealerReviews(dealerId: number): Promise<DealerReview[]> {
    const query = `
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.full_name AS rater_name,
        c.name AS car_name,
        b.id AS booking_id
      FROM reviews r
      JOIN users u ON r.rater_id = u.id
      JOIN cars c ON r.car_id = c.id
      JOIN bookings b ON r.booking_id = b.id
      WHERE r.dealer_id = $1
      ORDER BY r.created_at DESC
    `;

    const { rows } = await pool.query(query, [dealerId]);
    return rows as DealerReview[];
  },
};
