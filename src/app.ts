import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Car Booking Backend is running!");
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "API is healthy" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
