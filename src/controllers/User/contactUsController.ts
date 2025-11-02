import { Request, Response } from "express";
import { pool } from "../../config/db.js";

// Helper validators
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) =>
  /^\+?\d{7,15}$/.test(phone.replace(/\s+/g, ""));

// CREATE
export const createContact = async (req: Request, res: Response) => {
  const { full_name, email, phone_number, subject, message } = req.body;

  if (!full_name || !email || !phone_number || !subject || !message) {
    return res.status(400).json({
      success: false,
      code: 400,
      message:
        "Missing required field(s): full_name, email, phone_number, subject, message",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid email format",
    });
  }

  if (!isValidPhone(phone_number)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid phone number format",
    });
  }

  try {
    const query = `
      INSERT INTO contact_us (full_name, email, phone_number, subject, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [full_name, email, phone_number, subject, message];
    const result = await pool.query(query, values);
    res.status(201).json({ success: true, code: 201, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// READ ALL
export const getContacts = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_us ORDER BY created_at DESC"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// READ ONE
export const getContactById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Missing id in request",
    });
  }

  try {
    const result = await pool.query("SELECT * FROM contact_us WHERE id = $1", [
      id,
    ]);
    if (!result.rows.length) {
      return res
        .status(404)
        .json({ success: false, error: "Contact not found" });
    }
    res.json({ success: true, code: 200, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE
export const updateContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { full_name, email, phone_number, subject, message } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Missing id in request",
    });
  }

  if (!full_name || !email || !phone_number || !subject || !message) {
    return res.status(400).json({
      success: false,
      code: 400,
      message:
        "Missing required field(s): full_name, email, phone_number, subject, message",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid email format",
    });
  }

  if (!isValidPhone(phone_number)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Invalid phone number format",
    });
  }

  try {
    const query = `
      UPDATE contact_us
      SET full_name=$1, email=$2, phone_number=$3, subject=$4, message=$5
      WHERE id=$6
      RETURNING *;
    `;
    const values = [full_name, email, phone_number, subject, message, id];
    const result = await pool.query(query, values);
    if (!result.rows.length) {
      return res
        .status(404)
        .json({ success: false, error: "Contact not found" });
    }
    res.json({ success: true, code: 201, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// DELETE
export const deleteContact = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Missing id in request",
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM contact_us WHERE id=$1 RETURNING *",
      [id]
    );
    if (!result.rows.length) {
      return res
        .status(404)
        .json({ success: false, error: "Contact not found" });
    }
    res.json({
      success: true,
      code: 200,
      message: "Contact deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
