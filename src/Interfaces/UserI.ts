export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface SocialLogin {
  google?: { idToken: string; email: string };
  facebook?: { accessToken: string; email: string };
}

export interface User {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  role: "renter" | "dealer";
  password_hash?: string;
  social_login?: SocialLogin | null;
  profile_image?: string | null;
  reset_password_token?: string | null;
  reset_password_expire?: number | null;
  address?: Address | null;
  status?: "active" | "suspended" | "deleted";
  created_at?: Date;
  updated_at?: Date;
}
