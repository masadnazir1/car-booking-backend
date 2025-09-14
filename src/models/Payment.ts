import mongoose, { Schema, Document, Types } from "mongoose";

export type PaymentType = {
  bookingId: Types.ObjectId;
  payerId: Types.ObjectId;
  receiverId: Types.ObjectId;
  amount: number;
  paymentMethod: "card" | "paypal" | "stripe";
  paymentStatus: "paid" | "failed" | "pending" | "refunded";
  transactionId: string;
  commission: number;
  createdAt?: Date;
};

export interface IPayment extends PaymentType, Document {}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      unique: true,
      required: true,
    },
    payerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: Number,
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "stripe"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "failed", "pending", "refunded"],
      default: "pending",
    },
    transactionId: { type: String, required: true, unique: true },
    commission: Number,
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
