import mongoose, { Schema } from "mongoose";
const ReviewSchema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    raterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dealerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
}, { timestamps: true });
export default mongoose.model("Review", ReviewSchema);
