import { NextFunction, Request, Response } from "express";

const allowedOrigins = [
  "http://localhost:3000", // Backend dev server
  "http://localhost:3001", // Backend dev server
  "http://localhost:4200", // Angular dev server
  "http://localhost:43505", //  current frontend port
  "http://127.0.0.1:43505",
  "https://tapride.galaxydev.pk",
  "http://dealer-tapride.galaxydev.pk",
];

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const origin = req.headers.origin as string;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Preflight check
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}
