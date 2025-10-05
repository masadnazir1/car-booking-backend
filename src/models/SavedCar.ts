import { Schema, model, Document, Types } from "mongoose";

export interface ISavedCar extends Document {
  userId: Types.ObjectId;
  carId: Types.ObjectId;
  createdAt: Date;
}

const savedCarSchema = new Schema<ISavedCar>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent duplicate saves (user can't save same car twice)
savedCarSchema.index({ userId: 1, carId: 1 }, { unique: true });

export const SavedCar = model<ISavedCar>("SavedCar", savedCarSchema);
