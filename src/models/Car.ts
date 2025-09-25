import mongoose, { Schema, Document, Types } from "mongoose";

export type CarType = {
  dealerId: Types.ObjectId;
  brandId: Types.ObjectId; // Reference to Brand
  categoryId: Types.ObjectId; // Reference to Category
  name: string;
  description: string;
  images: string[];
  badge?: string;
  seats: number;
  doors: number;
  transmission: string;
  fuel: string;
  dailyRate: number;

  status: "available" | "unavailable" | "maintenance";
  location: string;
  ac: boolean; //Air Conditioning
  year: number; //Manufacturing year
  mileage: number; //Car mileage in KM
  createdAt?: Date;
  updatedAt?: Date;
};

export interface ICar extends CarType, Document {}

const CarSchema = new Schema<ICar>(
  {
    dealerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String },
    images: [{ type: String }],
    badge: String,
    seats: Number,
    doors: Number,
    transmission: String,
    fuel: String,
    dailyRate: Number, // used for minPrice / maxPrice filter
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },

    status: {
      type: String,
      enum: ["available", "unavailable", "maintenance"],
      default: "available",
    },
    location: { type: String, required: true },

    //fields for filters
    ac: { type: Boolean, default: true }, // Air Conditioning
    year: { type: Number, required: true }, // Car manufacturing year
    mileage: { type: Number, default: 0 }, // Total mileage in KM
  },
  { timestamps: true }
);

export default mongoose.model<ICar>("Car", CarSchema);
