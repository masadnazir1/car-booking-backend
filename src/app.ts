import express, { Application, Request, Response } from "express";
import router from "./routes/index.js";
import { corsMiddleware } from "./middleware/cors-middleware.js";
import { Database } from "./config/db.js";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Apply CORS middleware
app.use(corsMiddleware);

// Routes
app.use("/api", router);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "API is healthy" });
});

// Start server after DB connection
Database.connect().then(() => {
  app.listen(3000, () => {
    console.log(`Server running at http://localhost:${3000}`);
  });
});
