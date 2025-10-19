import { Router } from "express";
import DealerBusinessController from "../../controllers/Dealer/DealerBusiness.Controller.js";
import { uploadImages } from "../../middleware/uploadImages.js";
const router = Router();
const Controller = new DealerBusinessController();

router.get("/:dealerId", Controller.getBusinessDetails);
router.post("/", uploadImages.array("image", 1), Controller.addBusinessDetails);

export default router;
