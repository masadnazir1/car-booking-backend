import { Types } from "mongoose";

export const PLATFORM_COUPONS = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    maxDiscount: 1000,
    minBookingAmount: 3000,
    applicableCategories: [], // means all categories
    applicableDealers: [],
    eligibleUsers: [], // globally available
    startDate: new Date("2025-10-01"),
    endDate: new Date("2025-12-31"),
    usageLimit: 10000,
    perUserLimit: 1,
    status: "active",
    createdBy: new Types.ObjectId("000000000000000000000001"), // platform admin
  },
  {
    code: "WEEKEND20",
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 2000,
    minBookingAmount: 5000,
    applicableCategories: ["SUV", "Sedan"],
    applicableDealers: [],
    eligibleUsers: [],
    startDate: new Date("2025-10-05"),
    endDate: new Date("2025-12-31"),
    usageLimit: 5000,
    perUserLimit: 2,
    status: "active",
    createdBy: new Types.ObjectId("000000000000000000000001"),
  },
  {
    code: "FREEDAY",
    discountType: "flat",
    discountValue: 5000,
    maxDiscount: 5000,
    minBookingAmount: 10000,
    applicableCategories: [],
    applicableDealers: [],
    eligibleUsers: [],
    startDate: new Date("2025-10-01"),
    endDate: new Date("2025-11-30"),
    usageLimit: 2000,
    perUserLimit: 1,
    status: "active",
    createdBy: new Types.ObjectId("000000000000000000000001"),
  },
];
