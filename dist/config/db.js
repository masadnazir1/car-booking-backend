import mongoose from "mongoose";
import config from "./index.js";
export class Database {
    static async connect() {
        try {
            await mongoose.connect(config.mongoURI);
            console.log("MongoDB connected");
        }
        catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        }
    }
}
