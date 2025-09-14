import mongoose, { Schema, Document } from "mongoose";

export type FAQType = {
  title: string;
  description: string;
  role: "dealer" | "renter";
  createdAt?: Date;
};

export interface IFAQ extends FAQType, Document {}

const FAQSchema = new Schema<IFAQ>(
  {
    title: String,
    description: String,
    role: { type: String, enum: ["dealer", "renter"] },
  },
  { timestamps: true }
);

export default mongoose.model<IFAQ>("FAQ", FAQSchema);
