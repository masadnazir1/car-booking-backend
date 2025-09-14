import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/garirent",
  jwtSecret: process.env.JWT_SECRET || "secret",
  // Add more config values like API keys
};
