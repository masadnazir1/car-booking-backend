// src/middleware/uploadCarImages.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const tempFolder = path.join(process.cwd(), "tempUploads");
if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

export const uploadCarImages = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, tempFolder); // all uploads go to temp first
    },
    filename: (_req, file, cb) => {
      const unique = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, unique);
    },
  }),
});
