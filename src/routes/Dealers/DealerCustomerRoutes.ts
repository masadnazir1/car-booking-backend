import { Router } from "express";
import { DealerCustomerController } from "../../controllers/Dealer/DealerCustomerController.js";

const router = Router();
const Controller = new DealerCustomerController();

router.get("/customers/:dealer_id", Controller.getAllCustomers);
router.post("/customers/", Controller.addCustomer);

export default router;
