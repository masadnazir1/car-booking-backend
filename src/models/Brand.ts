import mongoose, { Schema, Document } from "mongoose";

export type BrandType = {
  name: string; // Brand name e.g. Toyota, Honda
  slug: string; // For clean URLs (e.g. "toyota")
  logo?: string; // Brand logo/icon URL
  country?: string; // Origin country
  description?: string; // Optional brand description
  foundedYear?: number; // Year brand was established
  website?: string; // Official website
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IBrand extends BrandType, Document {}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String },
    country: { type: String },
    description: { type: String },
    foundedYear: { type: Number },
    website: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBrand>("Brand", BrandSchema);
