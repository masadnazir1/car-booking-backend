import { DealerReview } from "./../../Interfaces/DealerReviewI";
import { pool } from "../../config/db.js";

interface BodyDealerReview {
  dealerId: number;
  startDate: string;
  endDate: string;
  minRating: number;
  maxRating: number;
  car_id: number;
  booking_id: number;
  limit: number;
  skip: number;
}

interface BodyDealerSingleReview {
  dealer_id: number;
  reviewId: number;
}

export const DealerReviewsService = {
  async getDealerSingleReivew(
    review: BodyDealerSingleReview
  ): Promise<DealerReview> {
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
      AND r.id = $2
    `;

    const { rows } = await pool.query(query, [
      review.dealer_id,
      review.reviewId,
    ]);

    return rows[0] as DealerReview;
  },

  async getDealerReviews(review: BodyDealerReview): Promise<DealerReview[]> {
    let query = `
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
      AND r.rating BETWEEN $2 and $3
    `;

    const values: any = [review.dealerId, review.minRating, review.maxRating];
    let idx = 4;

    if (review.startDate && review.endDate) {
      query += ` AND r.created_at BETWEEN $${idx} and $${idx + 1}`;
      values.push(review.startDate, review.endDate);
      idx += 2;
    }

    if (review.car_id) {
      query += ` AND r.car_id = $${idx}`;
      values.push(review.car_id);
      idx += 1;
    }

    if (review.booking_id) {
      query += ` AND r.booking_id = $${idx}`;
      values.push(review.booking_id);
      idx += 1;
    }

    query += ` ORDER BY r.created_at DESC
               LIMIT $${idx}
               OFFSET $${idx + 1}`;
    values.push(review.limit, review.skip);

    const { rows } = await pool.query(query, values);

    return rows as DealerReview[];
  },
};
