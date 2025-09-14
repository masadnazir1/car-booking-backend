import mongoose, { Schema } from "mongoose";
const SettingSchema = new Schema({
    key: { type: String, required: true, unique: true },
    value: Schema.Types.Mixed,
}, { timestamps: true });
export default mongoose.model("Setting", SettingSchema);
