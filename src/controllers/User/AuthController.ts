// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { UserModel } from "../../models/userModel.js";
import { pool } from "../../config/db.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../config/jwt.js";

dotenv.config();

export default class AuthController {
  constructor() {}

  // =========================
  // Register User (Renter)
  // =========================
  public registerUser = async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, password, role } = req.body;

      if (!fullName || !email || !phone || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user exists by email or phone using UserModel
      const existingByEmail = await UserModel.findByEmail(email);
      const existingByPhone = await UserModel.findByPhone(phone);
      if (existingByEmail || existingByPhone) {
        return res
          .status(400)
          .json({ message: "Email or phone already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        full_name: fullName,
        email,
        phone,
        password_hash: hashedPassword,
        role: role,
        status: "active",
      });

      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        JWT_SECRET as string,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      return res.status(201).json({ success: true, user: newUser, token });
    } catch (error) {
      console.error("registerUser error:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  // =========================
  // Login User (Renter)
  // =========================
  public loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Missing credentials" });

      const user = await UserModel.findByEmail(email);

      console.log("this is the user", user);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.password_hash)
        return res
          .status(400)
          .json({ message: "Password not set for this user" });

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET as string,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      return res.json({
        success: true,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },
        token,
      });
    } catch (error) {
      console.error("loginUser error:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  // =========================
  // Forgot Password (User or Dealer)
  // =========================
  public forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });

      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });

      // generate token (plaintext) and store its hash in DB
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = await bcrypt.hash(resetToken, 10);
      const expireTime = Date.now() + 60 * 60 * 1000; // store as ms epoch for compatibility with userModel

      await UserModel.setResetToken(email, resetTokenHash, expireTime);

      // send email with plaintext token
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>Hello ${user.full_name},</p>
               <p>Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
               <p>Link valid for 1 hour.</p>`,
      });

      return res.json({ success: true, message: "Password reset email sent" });
    } catch (error) {
      console.error("forgotPassword error:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  // =========================
  // Reset Password
  // =========================
  public resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword)
        return res
          .status(400)
          .json({ message: "Token and newPassword are required" });

      // NOTE:
      // UserModel currently stores hashed reset tokens.
      // To locate the correct user securely we must fetch users with non-null reset token
      // and compare using bcrypt.compare(plaintextToken, storedHash).
      // (This mirrors the secure Mongoose approach.)

      const { rows } = await pool.query(
        "SELECT id, reset_password_token, reset_password_expire FROM users WHERE reset_password_token IS NOT NULL"
      );

      let userFound: {
        id: number;
        reset_password_token: string;
        reset_password_expire: number;
      } | null = null;
      for (const row of rows) {
        if (row.reset_password_token) {
          const match = await bcrypt.compare(token, row.reset_password_token);
          if (
            match &&
            row.reset_password_expire &&
            row.reset_password_expire > Date.now()
          ) {
            userFound = row;
            break;
          }
        }
      }

      if (!userFound) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(userFound.id, hashedNewPassword);

      return res.json({
        success: true,
        message: "Password successfully reset",
      });
    } catch (error) {
      console.error("resetPassword error:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  };
}
