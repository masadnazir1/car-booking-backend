import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

pool
  .connect()
  .then(() =>
    console.log(
      "PostgreSQL connected successfully",
      process.env.PG_DATABASE,
      process.env.PG_HOST
    )
  )
  .catch((err) => console.error("Database connection failed:", err));
