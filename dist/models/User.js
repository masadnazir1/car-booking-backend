// src/models/User.ts
import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ["renter", "dealer"], required: true },
    passwordHash: { type: String },
    socialLogin: {
        google: { id: String, token: String },
        facebook: { id: String, token: String },
    },
    profileImage: { type: String },
    address: {
        street: String,
        city: String,
        province: String,
        country: String,
        zip: String,
        location: { type: { type: String }, coordinates: [Number] },
    },
    status: {
        type: String,
        enum: ["active", "suspended", "deleted"],
        default: "active",
    },
}, { timestamps: true });
UserSchema.index({ "address.location": "2dsphere" });
export default mongoose.model("User", UserSchema);
