import { pool } from "../config/db.js";
import { IMessage, ICreateMessageInput } from "../Interfaces/IMessage.js";

export const MessageModel = {
  async createMessage(data: ICreateMessageInput): Promise<IMessage> {
    const {
      booking_id,
      sender_id,
      receiver_id,
      message,
      message_type = "text",
      attachment_url,
    } = data;

    const query = `
      INSERT INTO messages 
        (booking_id, sender_id, receiver_id, message, message_type, attachment_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      booking_id,
      sender_id,
      receiver_id,
      message,
      message_type,
      attachment_url,
    ]);
    return rows[0] as IMessage;
  },

  async getConversation(
    user1_id: number,
    user2_id: number,
    booking_id?: number
  ): Promise<IMessage[]> {
    let query = `
      SELECT *
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
    `;
    const params = [user1_id, user2_id];
    if (booking_id) {
      query += " AND booking_id = $3";
      params.push(booking_id);
    }
    query += " ORDER BY created_at ASC";
    const { rows } = await pool.query(query, params);
    return rows as IMessage[];
  },

  async markAsRead(messageIds: number[]): Promise<void> {
    const query = `
      UPDATE messages
      SET is_read = true, updated_at = NOW()
      WHERE id = ANY($1::int[])
    `;
    await pool.query(query, [messageIds]);
  },

  /**
   * Fetch paginated conversation between two users
   * @param user1_id First user ID
   * @param user2_id Second user ID
   * @param booking_id Optional booking ID to filter messages
   * @param limit Number of messages per page
   * @param offset Number of messages to skip (for pagination)
   */
  async getConversationPaginated(
    user1_id: number,
    user2_id: number,
    booking_id?: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<IMessage[]> {
    try {
      let query = `
        SELECT *
        FROM messages
        WHERE (sender_id = $1 AND receiver_id = $2)
           OR (sender_id = $2 AND receiver_id = $1)
      `;

      const params: (number | undefined)[] = [user1_id, user2_id];

      if (booking_id) {
        query += ` AND booking_id = $3`;
        params.push(booking_id);
      }

      // Pagination
      query += ` ORDER BY created_at DESC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

      params.push(limit, offset);

      const { rows } = await pool.query(query, params);
      return rows as IMessage[];
    } catch (err) {
      console.error("Error fetching paginated conversation:", err);
      throw err;
    }
  },
};
