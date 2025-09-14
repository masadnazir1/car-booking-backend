import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.get("/", (req, res) => {
    res.send("Car Booking Backend is running!");
});
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "API is healthy" });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
