import mongoose, { Schema, Document, Types } from "mongoose";

export type ReviewType = {
  bookingId: Types.ObjectId;
  raterId: Types.ObjectId;
  dealerId: Types.ObjectId;
  carId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
};

export interface IReview extends ReviewType, Document {}

const ReviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    raterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dealerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", ReviewSchema);
