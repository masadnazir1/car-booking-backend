import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export class Database {
  public static async connect(): Promise<void> {
    try {
      if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
      }
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }
}
