import { Router } from "express";
import { paymentCancel, paymentSuccess } from "../controllers/paymentController.js";

const router = Router();

router.get("/payment-success", paymentSuccess);
router.get("/payment-cancel", paymentCancel);

export default router;
