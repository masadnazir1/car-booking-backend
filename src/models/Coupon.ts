import { Schema, model, Document, Types } from "mongoose";

//Interface for TypeScript
export interface ICoupon extends Document {
  code: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  maxDiscount?: number;

  minBookingAmount?: number;
  applicableCategories?: string[];
  applicableDealers?: Types.ObjectId[];
  eligibleUsers?: Types.ObjectId[];

  startDate: Date;
  endDate: Date;

  usageLimit: number;
  perUserLimit: number;

  usedCount: number;
  usedBy: {
    userId: Types.ObjectId;
    bookingId: Types.ObjectId;
    usedAt: Date;
  }[];

  status: "active" | "expired" | "disabled";
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
}

//Mongoose Schema
const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    maxDiscount: { type: Number },

    minBookingAmount: { type: Number, default: 0 },
    applicableCategories: [{ type: String }],
    applicableDealers: [{ type: Schema.Types.ObjectId, ref: "Dealer" }],
    eligibleUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    usageLimit: { type: Number, default: 1 },
    perUserLimit: { type: Number, default: 1 },

    usedCount: { type: Number, default: 0 },
    usedBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
        usedAt: { type: Date, default: Date.now },
      },
    ],

    status: {
      type: String,
      enum: ["active", "expired", "disabled"],
      default: "active",
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Export Model
export const Coupon = model<ICoupon>("Coupon", couponSchema);
