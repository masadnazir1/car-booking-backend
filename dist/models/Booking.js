import mongoose, { Schema } from "mongoose";
const BookingSchema = new Schema({
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
}, { timestamps: true });
BookingSchema.index({
    pickupLocation: "2dsphere",
    dropoffLocation: "2dsphere",
});
export default mongoose.model("Booking", BookingSchema);
