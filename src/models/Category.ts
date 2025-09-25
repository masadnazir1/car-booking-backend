import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string; // e.g., Sedan, SUV, Hatchback
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
