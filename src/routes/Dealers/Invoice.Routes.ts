import { Router } from "express";
import DealerInvoice from "../../controllers/Dealer/Invoice.Controller.js";
const router = Router();

const invoice = new DealerInvoice();

router.post("/generate", invoice.generateInvoice);
router.get("/:booking_id", invoice.getInvoice);

export default router;
