export interface Car {
  id?: number;
  dealer_id: number;
  brand_id: number;
  category_id: number;
  name: string;
  description?: string;
  images?: string[]; // PostgreSQL text[]
  badge?: string;
  seats?: number;
  doors?: number;
  transmission?: string;
  fuel?: string;
  daily_rate: number;
  status?: "available" | "unavailable" | "maintenance";
  location: string;
  ac?: boolean;
  year: number;
  mileage?: number;
  created_at?: Date;
  updated_at?: Date;
}
