import mongoose, { Schema } from "mongoose";
const FAQSchema = new Schema({
    title: String,
    description: String,
    role: { type: String, enum: ["dealer", "renter"] },
}, { timestamps: true });
export default mongoose.model("FAQ", FAQSchema);
