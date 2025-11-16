import express, { Application } from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { pool } from "./config/db.js";
import { corsMiddleware } from "./middleware/cors-middleware.js";
import router from "./routes/index.js";
import { runSetup } from "./setup/index.js";
import { initMessageSocket } from "./sockets/messageSocket.js";
const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
//Serve  folders as static
app.use("/Uploads", express.static(path.join(process.cwd(), "Uploads")));

// Routes
app.use("/api", router);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to car-booking backend" });
});

const PORT = process.env.PORT || 3000;

// Only run setup if a specific ENV is set, e.g., first deployment
if (process.env.RUN_SETUP === "true") {
  runSetup()
    .then(() => console.log("Initial setup finished"))
    .catch((err) => console.error("Setup failed:", err));
}

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize messaging socket
initMessageSocket(io);

// Start server after DB connection
pool.connect().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
