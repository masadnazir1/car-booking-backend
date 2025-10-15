export interface Review {
  id: number;
  booking_id: number;
  rater_id: number;
  dealer_id: number;
  car_id: number;
  rating: number; // 1–5
  comment?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
