// import { Request, Response } from "express";
// import { CouponModel } from "../models/couponModel.js";
// import { PLATFORM_COUPONS } from "../constants/coupons.js";

// export default class CouponController {
//   // Validate coupon
//   public validateCoupon = async (req: Request, res: Response) => {
//     const userId = Number(req.params.Id);
//     const { code, bookingAmount } = req.body;
//     const validation = await CouponModel.validateCoupon(
//       code,
//       userId,
//       bookingAmount
//     );
//     if (!validation.valid) return res.status(400).json(validation);
//     res.json(validation);
//   };

//   // Apply coupon
//   public applyCoupon = async (req: Request, res: Response) => {
//     const userId = Number(req.params.Id);
//     const { code, bookingId, bookingAmount } = req.body;
//     const result = await CouponModel.applyCoupon(
//       code,
//       userId,
//       bookingId,
//       bookingAmount
//     );
//     if (!result.valid) return res.status(400).json(result);
//     res.json(result);
//   };

//   // Create platform coupons
//   public createCoupon = async (_req: Request, res: Response) => {
//     try {
//       await CouponModel.create(PLATFORM_COUPONS);
//       res.status(201).json({ success: true, message: "Coupons created" });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: "Server Error" });
//     }
//   };
// }
