export interface UserCoupon {
  id: number;
  user_id: number;
  coupon_id: number;
  assigned_by?: number | null;
  used: boolean;
  used_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}
