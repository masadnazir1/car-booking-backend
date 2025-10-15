export interface Brand {
  id?: number;
  name: string;
  slug: string;
  logo?: string | null;
  country?: string | null;
  description?: string | null;
  founded_year?: number | null;
  website?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
