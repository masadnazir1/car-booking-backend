import mongoose, { Schema, Document } from "mongoose";

export type SettingType = {
  key: string;
  value: any;
  updatedAt?: Date;
};

export interface ISetting extends SettingType, Document {}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    value: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model<ISetting>("Setting", SettingSchema);
