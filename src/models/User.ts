// src/models/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export type SocialLoginType = {
  google?: { id: string; token: string };
  facebook?: { id: string; token: string };
};

export type AddressType = {
  street?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  location?: { type: "Point"; coordinates: [number, number] };
};

export type UserType = {
  fullName: string;
  email: string;
  phone: string;
  role: "renter" | "dealer";
  passwordHash?: string;
  socialLogin?: SocialLoginType;
  profileImage?: string;
  address?: AddressType;
  status: "active" | "suspended" | "deleted";
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IUser extends UserType, Document {}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ["renter", "dealer"], required: true },
    passwordHash: { type: String },
    socialLogin: {
      google: { id: String, token: String },
      facebook: { id: String, token: String },
    },
    profileImage: { type: String },
    address: {
      street: String,
      city: String,
      province: String,
      country: String,
      zip: String,
      location: { type: { type: String }, coordinates: [Number] },
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

UserSchema.index({ "address.location": "2dsphere" });

export default mongoose.model<IUser>("User", UserSchema);
