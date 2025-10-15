import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Join your user room
socket.emit("joinRoom", 1); //user ID

// Listen for incoming messages
socket.on("receiveMessage", (msg) => {
  console.log("Received message:", msg);
});

// Send a message
socket.emit("sendMessage", {
  booking_id: 1,
  sender_id: 1,
  receiver_id: 2,
  message: "Hello from test client",
  message_type: "text",
});

// Confirm sent message
socket.on("messageSent", (msg) => {
  console.log("Message saved:", msg);
});

// Mark as read
socket.emit("markRead", [1, 2]);
