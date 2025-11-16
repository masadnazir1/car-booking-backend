import { Router } from "express";
import { DealerCustomerController } from "../../controllers/Dealer/DealerCustomer.Controller.js";

const router = Router();
const Controller = new DealerCustomerController();

router.get("/:dealer_id", Controller.getAllCustomers);
router.post("/", Controller.addCustomer);

export default router;
