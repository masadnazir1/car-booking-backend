import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();
const auth = new AuthController();

router.post("/user/register", auth.registerUser);
router.post("/user/login", auth.loginUser);

router.post("/dealer/register", auth.registerDealer);
router.post("/dealer/login", auth.loginDealer);

router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);

export default router;
