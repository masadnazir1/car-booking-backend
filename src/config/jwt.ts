import { Secret } from "jsonwebtoken";

export const JWT_SECRET: Secret = process.env.JWT_SECRET || "changeme";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
