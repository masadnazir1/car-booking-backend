// src/models/Car.ts
import mongoose, { Schema } from "mongoose";
const CarSchema = new Schema({
    dealerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    badge: String,
    seats: Number,
    doors: Number,
    transmission: String,
    fuel: String,
    dailyRate: Number,
    status: {
        type: String,
        enum: ["available", "unavailable", "maintenance"],
        default: "available",
    },
    location: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
    },
}, { timestamps: true });
CarSchema.index({ location: "2dsphere" });
export default mongoose.model("Car", CarSchema);
