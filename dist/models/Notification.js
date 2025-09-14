import mongoose, { Schema } from "mongoose";
const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["booking_update", "payment", "reminder"],
        required: true,
    },
    message: String,
    read: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model("Notification", NotificationSchema);
