import { Router } from "express";
const router = Router();
import DealerInvoice from "../../controllers/Dealer/InvoiceController.js";

const invoice = new DealerInvoice();

router.post("/generate", invoice.generateInvoice);
router.get("/:booking_id", invoice.getInvoice);

export default router;
