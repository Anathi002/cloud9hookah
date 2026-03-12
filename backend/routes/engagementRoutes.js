import { Router } from "express";
import { createBookingRequest, trackEngagementEvent } from "../controllers/engagementController.js";

const router = Router();

router.post("/book-now", createBookingRequest);
router.post("/engagement/event", trackEngagementEvent);

export default router;
