import mongoose, { Schema, Document, Types } from "mongoose";

export type NotificationType = {
  userId: Types.ObjectId;
  type: "booking_update" | "payment" | "reminder";
  message: string;
  read: boolean;
  createdAt?: Date;
};

export interface INotification extends NotificationType, Document {}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["booking_update", "payment", "reminder"],
      required: true,
    },
    message: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
