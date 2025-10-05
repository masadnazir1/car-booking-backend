import { Request, Response } from "express";
import { Coupon } from "../models/Coupon.js";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { PLATFORM_COUPONS } from "../constants/coupons.js";

export default class CouponController {
  constructor() {}

  //Get all available coupons for logged-in user
  public getAvailableCoupons = async (req: Request, res: Response) => {
    const { Id } = req.params;
    try {
      const userId = new mongoose.Types.ObjectId(Id);

      const now = new Date();

      const coupons = await Coupon.find({
        status: "active",
        startDate: { $lte: now },
        endDate: { $gte: now },
        $or: [
          { eligibleUsers: { $size: 0 } }, // general coupons
          { eligibleUsers: { $in: [userId] } }, // personalized coupons
        ],
      }).lean();

      return res.json({ success: true, coupons });
    } catch (error) {
      console.error("Get Available Coupons Error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  //Validate coupon before applying
  public validateCoupon = async (req: Request, res: Response) => {
    const { code, bookingAmount } = req.body;
    const { Id } = req.params;
    try {
      if (!code || !bookingAmount) {
        return res.status(400).json({
          success: false,
          message: "Coupon code and are required bookingAmount",
        });
      }

      const userId = new mongoose.Types.ObjectId(Id);

      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        return res
          .status(404)
          .json({ success: false, message: "Coupon not found" });
      }

      const now = new Date();

      // Check status & validity
      if (
        coupon.status !== "active" ||
        coupon.startDate > now ||
        coupon.endDate < now
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon is expired or inactive" });
      }

      // Check usage limits
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon usage limit reached" });
      }

      const userUsed = coupon.usedBy.filter(
        (u) => u.userId.toString() === userId.toString()
      ).length;
      if (userUsed >= coupon.perUserLimit) {
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon",
        });
      }

      // Check minimum booking
      if (bookingAmount < (coupon.minBookingAmount || 0)) {
        return res.status(400).json({
          success: false,
          message: `Minimum booking amount must be ${coupon.minBookingAmount}`,
        });
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountType === "flat") {
        discount = coupon.discountValue;
      } else if (coupon.discountType === "percentage") {
        discount = (bookingAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      }

      return res.json({
        success: true,
        message: "Coupon is valid",
        discount,
        finalAmount: bookingAmount - discount,
      });
    } catch (error) {
      console.error("Validate Coupon Error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  //Apply coupon during booking (save usage)
  public applyCoupon = async (req: Request, res: Response) => {
    const { code, bookingId, bookingAmount } = req.body;
    const { Id } = req.params;
    try {
      if (!code || !bookingId || !bookingAmount) {
        return res.status(400).json({
          success: false,
          message: "code, bookingId, bookingAmount are required fields",
        });
      }

      const userId = new mongoose.Types.ObjectId(Id);

      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        return res
          .status(404)
          .json({ success: false, message: "Coupon not found" });
      }

      const now = new Date();

      if (
        coupon.status !== "active" ||
        coupon.startDate > now ||
        coupon.endDate < now
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon is expired or inactive" });
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon usage limit reached" });
      }

      const userUsed = coupon.usedBy.filter(
        (u) => u.userId.toString() === userId.toString()
      ).length;
      if (userUsed >= coupon.perUserLimit) {
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon",
        });
      }

      if (bookingAmount < (coupon.minBookingAmount || 0)) {
        return res.status(400).json({
          success: false,
          message: `Minimum booking amount must be ${coupon.minBookingAmount}`,
        });
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountType === "flat") {
        discount = coupon.discountValue;
      } else if (coupon.discountType === "percentage") {
        discount = (bookingAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      }

      // Save usage
      coupon.usedCount += 1;
      coupon.usedBy.push({
        userId,
        bookingId: new Types.ObjectId(bookingId),
        usedAt: new Date(),
      });

      await coupon.save();

      return res.json({
        success: true,
        message: "Coupon applied successfully",
        discount,
        finalAmount: bookingAmount - discount,
      });
    } catch (error) {
      console.error("Apply Coupon Error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // Create a new coupon
  public createCoupon = async (req: Request, res: Response) => {
    try {
      // Validate required fields
      for (const coupon of PLATFORM_COUPONS) {
        // console.log("token", token);

        const exists = await Coupon.findOne({ code: coupon.code });

        if (!exists) {
          console.log("pehly bana howa nii hai");
          await Coupon.create(coupon);
          console.log(`Created coupon: ${coupon.code}`);
        } else {
          console.log(`Coupon already exists: ${coupon.code}`);
        }
      }

      return res.status(201).json({
        success: true,
        message: "Coupon created successfully",
      });
    } catch (error) {
      console.error("Create Coupon Error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}
