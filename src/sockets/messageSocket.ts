import { Server, Socket } from "socket.io";
import { MessageModel } from "../models/messageModel.js";
import { IMessage, ICreateMessageInput } from "../Interfaces/IMessage.js";

export const initMessageSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Join a room for the logged-in user
    socket.on("joinRoom", (userId: number) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    // Send a message
    socket.on("sendMessage", async (data: ICreateMessageInput) => {
      try {
        // Save message in DB
        const message: IMessage = await MessageModel.createMessage(data);

        // Emit message to receiver
        io.to(`user_${data.receiver_id}`).emit("receiveMessage", message);

        // Emit back to sender for confirmation
        socket.emit("messageSent", message);
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", { message: "Message not sent" });
      }
    });

    // Mark messages as read
    socket.on("markRead", async (messageIds: number[]) => {
      try {
        await MessageModel.markAsRead(messageIds);
      } catch (err) {
        console.error("Error marking messages read:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
