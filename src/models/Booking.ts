import mongoose, { Schema, Document, Types } from "mongoose";

export type BookingType = {
  carId: Types.ObjectId;
  renterId: Types.ObjectId;
  dealerId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  days: number;
  totalPrice: number;
  discount: number;
  finalAmount: number;
  couponId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  pickupLocation: string;
  dropoffLocation: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IBooking extends BookingType, Document {}

const BookingSchema = new Schema<IBooking>(
  {
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    renterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dealerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: Date,
    endDate: Date,
    days: Number,
    totalPrice: Number,
    discount: Number,
    finalAmount: Number,
    couponId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
