import { Request, Response } from "express";
import { MessageModel } from "../../models/messageModel.js";

export class messageController {
  constructor() {}

  // Create/send a message
  public createMessage = async (req: Request, res: Response) => {
    try {
      const {
        booking_id,
        sender_id,
        receiver_id,
        message,
        message_type,
        attachment_url,
      } = req.body;

      if (!sender_id || !receiver_id || !message) {
        return res
          .status(400)
          .json({ error: "sender_id, receiver_id, and message are required" });
      }

      const newMessage = await MessageModel.createMessage({
        booking_id,
        sender_id,
        receiver_id,
        message,
        message_type,
        attachment_url,
      });

      return res.status(201).json({ success: true, message: newMessage });
    } catch (err: any) {
      console.error("Error creating message:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // Get paginated conversation between two users
  public getConversation = async (req: Request, res: Response) => {
    try {
      const user1_id = Number(req.params.user1_id);
      const user2_id = Number(req.params.user2_id);
      const booking_id = req.query.booking_id
        ? Number(req.query.booking_id)
        : undefined;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const offset = (page - 1) * limit;

      const messages = await MessageModel.getConversationPaginated(
        user1_id,
        user2_id,
        booking_id,
        limit,
        offset
      );

      return res.json({ page, limit, messages });
    } catch (err: any) {
      console.error("Error fetching conversation:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // Mark messages as read
  public markAsRead = async (req: Request, res: Response) => {
    try {
      const { messageIds } = req.body;

      if (!Array.isArray(messageIds) || messageIds.length === 0) {
        return res.status(400).json({ error: "messageIds array is required" });
      }

      await MessageModel.markAsRead(messageIds);

      return res.json({ success: true, message: "Messages marked as read" });
    } catch (err: any) {
      console.error("Error marking messages read:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
