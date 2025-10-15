export interface DealerBusiness {
  id?: number;
  user_id: number;
  business_name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  established_year?: number;
  registration_number?: string;
  tax_id?: string;
  address?: Record<string, any>;
  contact_email?: string;
  contact_phone?: string;
  status?: "pending" | "approved" | "rejected";
  created_at?: Date;
  updated_at?: Date;
}
