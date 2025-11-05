export interface Booking {
  id?: number;
  car_id: number;
  renter_id: number;
  dealer_id: number;
  start_date: Date;
  end_date: Date;
  days: number;
  total_price: number;
  discount?: number;
  final_amount: number;
  coupon_id?: string | null;
  isInvoiceGenerated?: Boolean;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status?: "unpaid" | "paid" | "refunded";
  pickup_location: string;
  dropoff_location: string;
  created_at?: Date;
  updated_at?: Date;
}
