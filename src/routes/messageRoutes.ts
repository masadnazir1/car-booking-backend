import { Router } from "express";
import { messageController } from "../controllers/message/messageController.js";

const router = Router();
const controller = new messageController();

router.post("/create", controller.createMessage);
router.get("/:user1_id/:user2_id", controller.getConversation);
router.post("/mark-read", controller.markAsRead);

export default router;
