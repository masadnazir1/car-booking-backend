// src/models/Car.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export type CarType = {
  dealerId: Types.ObjectId;
  name: string;
  category: string;
  description: string;
  images: string[];
  badge?: string;
  seats: number;
  doors: number;
  transmission: string;
  fuel: string;
  dailyRate: number;
  status: "available" | "unavailable" | "maintenance";
  location: { type: "Point"; coordinates: [number, number] };
  createdAt?: Date;
  updatedAt?: Date;
};

export interface ICar extends CarType, Document {}

const CarSchema = new Schema<ICar>(
  {
    dealerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    badge: String,
    seats: Number,
    doors: Number,
    transmission: String,
    fuel: String,
    dailyRate: Number,
    status: {
      type: String,
      enum: ["available", "unavailable", "maintenance"],
      default: "available",
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

CarSchema.index({ location: "2dsphere" });

export default mongoose.model<ICar>("Car", CarSchema);
