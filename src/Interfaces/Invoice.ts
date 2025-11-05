export default interface Invoice {
  id: number;
  booking_id: number;
  dealer_generating: number;
  generated_for: number;
  invoice_number: string;
  issue_date?: Date;
  payment_id?: number | null;
  notes?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
