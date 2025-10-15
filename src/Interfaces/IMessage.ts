// src/types/message.ts

export interface IMessage {
  id: number;
  booking_id?: number; // optional if message is not tied to a booking
  sender_id: number;
  receiver_id: number;
  message: string;
  message_type: "text" | "image" | "file";
  attachment_url?: string; // optional
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateMessageInput {
  booking_id?: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  message_type?: "text" | "image" | "file"; // defaults to 'text' in model
  attachment_url?: string;
}
