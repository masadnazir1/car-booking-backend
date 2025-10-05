import { model, Schema, Types } from "mongoose";

export interface IUserCoupon extends Document {
  userId: Types.ObjectId;
  couponId: Types.ObjectId;
  assignedBy: Types.ObjectId; // admin or system
  assignedAt: Date;
  used: boolean;
  usedAt?: Date;
}

const userCouponSchema = new Schema<IUserCoupon>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    used: { type: Boolean, default: false },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

export const UserCoupon = model<IUserCoupon>("UserCoupon", userCouponSchema);
