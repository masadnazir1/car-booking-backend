import mongoose, { Schema, Document, Types } from "mongoose";

export type BookingType = {
  carId: Types.ObjectId;
  renterId: Types.ObjectId;
  dealerId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  days: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  pickupLocation: { type: "Point"; coordinates: [number, number] };
  dropoffLocation: { type: "Point"; coordinates: [number, number] };
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
    pickupLocation: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    dropoffLocation: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
  },
  { timestamps: true }
);

BookingSchema.index({
  pickupLocation: "2dsphere",
  dropoffLocation: "2dsphere",
});

export default mongoose.model<IBooking>("Booking", BookingSchema);
