import express, { Application } from "express";
import http from "http";
import { Server } from "socket.io";
import router from "./routes/index.js";
import { corsMiddleware } from "./middleware/cors-middleware.js";
import { pool } from "./config/db.js";
import { initMessageSocket } from "./sockets/messageSocket.js";
import path from "path";
const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
//Serve DealersData folder as static
app.use(
  "/DealersData",
  express.static(path.join(process.cwd(), "DealersData"))
);

// Routes
app.use("/api", router);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to car-booking backend" });
});

const PORT = process.env.PORT || 3000;

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
