// import express from "express";
// import UserCouponController from "../controllers/User/UserCouponController.js";

// const router = express.Router();
// const userCouponController = new UserCouponController();

// /**
//  * @route   POST /api/user-coupons/assign
//  * @desc    Assign a coupon to a user
//  * @access  Admin or System
//  */
// router.post("/assign", (req, res) =>
//   userCouponController.assignCouponToUser(req, res)
// );

// /**
//  * @route   GET /api/user-coupons/:userId
//  * @desc    Get all coupons assigned to a specific user
//  * @access  User or Admin
//  */
// router.get("/:userId", (req, res) =>
//   userCouponController.getUserCoupons(req, res)
// );

// /**
//  * @route   POST /api/user-coupons/validate
//  * @desc    Validate a coupon before applying it to a booking
//  * @access  User
//  */
// router.post("/validate", (req, res) =>
//   userCouponController.validateCoupon(req, res)
// );

// /**
//  * @route   DELETE /api/user-coupons/:id
//  * @desc    Remove a coupon assigned to a user
//  * @access  User or Admin
//  */
// router.delete("/:id", (req, res) =>
//   userCouponController.removeUserCoupon(req, res)
// );

// export default router;
