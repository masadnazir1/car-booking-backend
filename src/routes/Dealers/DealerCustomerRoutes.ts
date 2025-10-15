import { Router } from "express";
import { DealerCustomerController } from "../../controllers/Dealer/DealerCustomerController.js";

const router = Router();
const Controller = new DealerCustomerController();

router.get("/customers/:dealer_id", Controller.getAllCustomers);
router.get("/customers/status/:dealer_id", Controller.getCustomersStatus);

export default router;
