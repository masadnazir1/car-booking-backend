import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import dotenv from "dotenv";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt.js";

dotenv.config();

export default class AuthController {
  constructor() {}

  // =========================
  // User Account Creation
  // =========================
  public registerUser = async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: true, message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullName,
        email,
        phone,
        passwordHash: hashedPassword,
        role: "renter",
        status: "active",
      });

      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        JWT_SECRET as string, // make sure it's always a string
        { expiresIn: JWT_EXPIRES_IN } as SignOptions // cast the object, not the string
      );

      res.status(201).json({ success: true, user: newUser, token });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

  // =========================
  // User Login
  // =========================
  public loginUser = async (req: Request, res: Response) => {
    console.log(req.path);
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.passwordHash) {
        return res
          .status(500)
          .json({ message: "Password not set for this user" });
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET as string,
        {
          expiresIn: JWT_EXPIRES_IN,
        } as SignOptions
      );

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

  // =========================
  // Dealer Account Creation
  // =========================
  public registerDealer = async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, password } = req.body;

      const existingDealer = await User.findOne({ email });
      if (existingDealer) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newDealer = await User.create({
        fullName,
        email,
        phone,
        passwordHash: hashedPassword,
        role: "dealer",
        status: "active",
      });

      const token = jwt.sign(
        { id: newDealer._id, role: newDealer.role },
        JWT_SECRET as string,
        {
          expiresIn: JWT_EXPIRES_IN,
        } as SignOptions
      );

      res.status(201).json({ dealer: newDealer, token });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

  // =========================
  // Dealer Login
  // =========================
  public loginDealer = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const dealer = await User.findOne({ email, role: "dealer" });
      if (!dealer) return res.status(404).json({ message: "Dealer not found" });

      if (!dealer.passwordHash) {
        return res
          .status(500)
          .json({ message: "Password not set for this user" });
      }

      const match = await bcrypt.compare(password, dealer.passwordHash);
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: dealer._id, role: dealer.role },
        JWT_SECRET as string,
        {
          expiresIn: JWT_EXPIRES_IN,
        } as SignOptions
      );

      res.json({ dealer, token });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

  // =========================
  // Forgot Password (User or Dealer)
  // =========================
  public forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = await bcrypt.hash(resetToken, 10);

      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save();

      // Send email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>Hello ${user.fullName},</p>
               <p>Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
               <p>Link valid for 1 hour.</p>`,
      });

      res.json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };

  // =========================
  // Reset Password
  // =========================
  public resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      const users = await User.find({}); // find all users (improve: find by token hash if stored)
      let userFound = null;

      for (const u of users) {
        if (u.resetPasswordToken) {
          const match = await bcrypt.compare(token, u.resetPasswordToken);
          if (match && u.resetPasswordExpire! > Date.now()) {
            userFound = u;
            break;
          }
        }
      }

      if (!userFound)
        return res.status(400).json({ message: "Invalid or expired token" });

      userFound.passwordHash = await bcrypt.hash(newPassword, 10);
      userFound.resetPasswordToken = undefined;
      userFound.resetPasswordExpire = undefined;
      await userFound.save();

      res.json({ message: "Password successfully reset" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };
}
