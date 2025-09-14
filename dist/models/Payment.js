import mongoose, { Schema } from "mongoose";
const PaymentSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model("Payment", PaymentSchema);
