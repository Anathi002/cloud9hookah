import { Router } from "express";
import { handlePayfastItn } from "../controllers/webhookController.js";

const router = Router();

router.post("/payfast-itn", handlePayfastItn);

export default router;
