export interface Coupon {
  id: number;
  code: string;
  discount_type: "flat" | "percentage";
  discount_value: number;
  max_discount?: number | null;
  min_booking_amount?: number | null;
  applicable_categories?: string[] | null; // e.g. ['SUV', 'Sedan']
  applicable_dealers?: string[] | null; // UUIDs as strings
  eligible_users?: string[] | null; // UUIDs as strings
  start_date: Date;
  end_date: Date;
  usage_limit?: number;
  per_user_limit?: number;
  used_count?: number;
  used_by?: { userId: string; bookingId: number; usedAt: string }[]; // from JSONB
  status: "active" | "expired" | "disabled";
  created_by: string; // Admin UUID
  created_at?: Date;
  updated_at?: Date;
}
