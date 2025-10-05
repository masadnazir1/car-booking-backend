import { Request, Response } from "express";
import mongoose from "mongoose";
import { Coupon } from "../models/Coupon.js";
import { UserCoupon } from "../models/UserCoupon.js";

/**
 * Controller responsible for handling user-specific coupon operations.
 * Includes assigning coupons, retrieving user coupons, and checking validity.
 */
export default class UserCouponController {
  constructor() {}

  /**
   * @route POST /api/user-coupons/assign
   * @desc Assign a coupon to a user (manually or automatically)
   * @access Admin or System
   */
  public assignCouponToUser = async (req: Request, res: Response) => {
    const { userId, couponCode, assignedBy } = req.body;

    try {
      if (!userId || !couponCode || !assignedBy) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields." });
      }

      // Find the coupon by code
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (!coupon) {
        return res
          .status(404)
          .json({ success: false, message: "Coupon not found." });
      }

      // Check if coupon is expired or disabled
      const now = new Date();
      if (coupon.status !== "active" || now > coupon.endDate) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon is expired or inactive." });
      }

      // Check if user already has this coupon
      const alreadyAssigned = await UserCoupon.findOne({
        userId,
        couponId: coupon._id,
      });

      if (alreadyAssigned) {
        return res
          .status(400)
          .json({ success: false, message: "User already has this coupon." });
      }

      // Assign coupon
      const userCoupon = await UserCoupon.create({
        userId,
        couponId: coupon._id,
        assignedBy,
        assignedAt: new Date(),
      });

      return res.json({
        success: true,
        message: "Coupon assigned successfully.",
        data: userCoupon,
      });
    } catch (error) {
      console.error("Assign Coupon Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error assigning coupon." });
    }
  };

  /**
   * @route GET /api/user-coupons/:userId
   * @desc Get all coupons assigned to a user
   * @access User / Admin
   */
  public getUserCoupons = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID." });
      }

      // Fetch user coupons with coupon details
      const coupons = await UserCoupon.find({ userId })
        .populate("couponId")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: coupons.length,
        coupons,
      });
    } catch (error) {
      console.error("Get User Coupons Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error fetching coupons." });
    }
  };

  /**
   * @route POST /api/user-coupons/validate
   * @desc Validate a user's coupon before applying it to a booking
   * @access User
   */
  public validateCoupon = async (req: Request, res: Response) => {
    const { userId, couponCode, bookingAmount } = req.body;

    try {
      if (!userId || !couponCode || !bookingAmount) {
        return res.status(400).json({
          success: false,
          message: "userId, couponCode and bookingAmount are required.",
        });
      }

      // Find coupon by code
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon) {
        return res
          .status(404)
          .json({ success: false, message: "Coupon not found." });
      }

      // Check validity
      const now = new Date();
      if (coupon.status !== "active" || now > coupon.endDate) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon is expired or inactive." });
      }

      if (bookingAmount < (coupon.minBookingAmount || 0)) {
        return res.status(400).json({
          success: false,
          message: `Minimum booking amount required is ${coupon.minBookingAmount}`,
        });
      }

      // Check user has the coupon
      const userCoupon = await UserCoupon.findOne({
        userId,
        couponId: coupon._id,
      });

      if (!userCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon not assigned to this user.",
        });
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = (bookingAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else if (coupon.discountType === "flat") {
        discount = coupon.discountValue;
      }

      return res.json({
        success: true,
        message: "Coupon is valid.",
        discount,
        finalAmount: bookingAmount - discount,
      });
    } catch (error) {
      console.error("Validate Coupon Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error validating coupon." });
    }
  };

  /**
   * @route DELETE /api/user-coupons/:id
   * @desc Remove a coupon assigned to a user
   * @access Admin or User
   */
  public removeUserCoupon = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid coupon ID." });
      }

      const deleted = await UserCoupon.findByIdAndDelete(id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "User coupon not found." });
      }

      return res.json({
        success: true,
        message: "User coupon removed successfully.",
      });
    } catch (error) {
      console.error("Remove User Coupon Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error removing coupon." });
    }
  };
}
