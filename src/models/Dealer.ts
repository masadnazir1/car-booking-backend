import mongoose, { Schema, Document, Types } from "mongoose";

export type DealerType = {
  userId: Types.ObjectId;
  companyName: string;
  licenseNumber?: string;
  avatar?: string;
  rating?: number;
  bio?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    location?: { type: "Point"; coordinates: [number, number] };
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IDealer extends DealerType, Document {}

const DealerSchema = new Schema<IDealer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: { type: String, required: true },
    licenseNumber: { type: String },
    avatar: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    bio: { type: String },
    address: {
      street: String,
      city: String,
      province: String,
      country: String,
      zip: String,
      location: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
      },
    },
  },
  { timestamps: true }
);

DealerSchema.index({ "address.location": "2dsphere" });

export default mongoose.model<IDealer>("Dealer", DealerSchema);
